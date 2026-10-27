// Disposable local servers only. Never accepts a production base URL.
import {chromium} from '@playwright/test';
import {spawn,spawnSync} from 'node:child_process';
import {mkdtemp,readFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import {validateDisposableDatabase} from './disposable-database.mjs';
const root=resolve(fileURLToPath(new URL('..',import.meta.url)));
const authDB=process.env.E2E_DATABASE_URL;
if(authDB)validateDisposableDatabase(authDB);
const env={PATH:process.env.PATH,HOME:process.env.HOME,NODE_ENV:'production',APP_MODE:'demo',APP_ORIGIN:'http://localhost:4335',DATABASE_URL:'',STRIPE_RESTRICTED_KEY:'',META_ACCESS_TOKEN:'',META_API_VERSION:'',POSTHOG_PERSONAL_KEY:'',POSTHOG_HOST:'',POSTHOG_PROJECT_ID:'',POSTHOG_PSEUDONYM_SECRET:'',NEXT_TELEMETRY_DISABLED:'1'};
const children=[];let browser;const temp=await mkdtemp(join(tmpdir(),'stats-browser-'));
async function server(port,extra={}){
 const child=spawn(process.execPath,[join(root,'node_modules/next/dist/bin/next'),'start','-H','127.0.0.1','-p',String(port)],{cwd:root,env:{...env,...extra},stdio:'ignore'});children.push(child);
 const base=`http://localhost:${port}`;
 for(let i=0;i<100;i++){if(child.exitCode!==null)throw Error('Isolated browser server failed; check port/build');try{await fetch(base+'/login');return base;}catch{await new Promise(r=>setTimeout(r,150));}}
 throw Error('Browser server timeout');
}
try{
 browser=await chromium.launch();
 const base=await server(4335);
 for(const width of [1440,390]){
  const page=await browser.newPage({viewport:{width,height:900}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base);await page.locator('.demo-banner').waitFor();
  for(const style of ['studio','editorial','terminal','cosmos','executive']){
   await page.getByLabel('Estilo').selectOption(style);
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`overflow ${style}/${width}`);
  }
  for(const section of ['Marketing','Producto','Email','Resumen'])await page.getByRole('navigation').getByRole('button',{name:section,exact:true}).click();
  for(const example of ['software','course','service']){await page.getByLabel('Ejemplo',{exact:true}).selectOption(example);assert.equal(await page.locator('.funnel-stages li').count(),4);}
  await page.getByLabel('Período').selectOption('7');await page.waitForFunction(()=>document.querySelectorAll('.bar-group').length===7);
  await page.getByRole('button',{name:'Actualizar',exact:true}).click();await page.getByRole('button',{name:'Actualizar',exact:true}).waitFor();
  assert.deepEqual(errors,[]);await page.close();
 }
 console.log('PASS: five designs at1440/390, navigation, period, refresh, console');
 if(!authDB){console.log('SKIP: WebAuthn requires E2E_DATABASE_URL (local disposable *_e2e_test)');}
 else{
  const origin='http://localhost:4336',password='synthetic-browser-test-password-941',username='browser-test';
  const authEnv={...env,APP_MODE:'live',APP_ORIGIN:origin,DATABASE_URL:authDB};
  const setup=()=>{const result=spawnSync(process.execPath,[join(root,'scripts/auth-setup.mjs'),'--reset','--password-stdin',`--username=${username}`],{cwd:temp,env:authEnv,input:password+'\n',encoding:'utf8'});assert.equal(result.status,0,'Disposable auth setup failed');};
  setup();await server(4336,authEnv);
  const context=await browser.newContext(),page=await context.newPage();const cdp=await context.newCDPSession(page);
  await cdp.send('WebAuthn.enable');await cdp.send('WebAuthn.addVirtualAuthenticator',{options:{protocol:'ctap2',transport:'internal',hasResidentKey:true,hasUserVerification:true,isUserVerified:true,automaticPresenceSimulation:true}});
  const status=async()=>(await context.request.get(origin+'/api/dashboard')).status();
  assert.equal(await status(),401);
  assert.equal((await context.request.post(origin+'/api/auth/login',{headers:{Origin:'https://foreign.example'},data:{}})).status(),403);
  const bootstrapToken=(await readFile(join(temp,'.auth-bootstrap'),'utf8')).trim();
  assert.equal((await context.request.post(origin+'/api/auth/login',{headers:{Origin:origin},data:{username,password,bootstrapToken}})).status(),200);assert.equal(await status(),401);
  let registration;page.on('request',r=>{if(r.url().endsWith('/register/verify'))registration=r.postDataJSON();});
  const login=async(initial=false)=>{await page.goto(origin+'/login');await page.locator('#username').fill(username);await page.locator('#password').fill(password);if(initial){await page.locator('summary').click();await page.locator('#bootstrapToken').fill(bootstrapToken);}await page.getByRole('button',{name:'Entrar con passkey'}).click();await page.waitForURL(origin+'/');};
  await login(true);assert.equal(await status(),200);
  assert.equal(await page.locator('.demo-banner').count(),0);
  assert.equal(await page.locator('.demo-lab').count(),0);
  assert.equal((await context.request.post(origin+'/api/auth/register/verify',{headers:{Origin:origin},data:registration})).status(),401);
  const cookie=(await context.cookies()).find(c=>c.name==='stats_session');assert(cookie?.httpOnly&&cookie.sameSite==='Strict');
  await page.setViewportSize({width:390,height:844});
  const logout=page.getByRole('button',{name:'Cerrar sesión',exact:true}).filter({visible:true});
  assert.equal(await logout.count(),1,'Mobile must expose logout');await logout.click();await page.waitForURL(origin+'/login');assert.equal(await status(),401);
  const stale=await browser.newContext({extraHTTPHeaders:{Cookie:`stats_session=${cookie.value}`}});assert.equal((await stale.request.get(origin+'/api/dashboard')).status(),401);await stale.close();
  await login();assert.equal(await status(),200);setup();assert.equal(await status(),401);
  await context.close();console.log('PASS: anonymous/origin denial, password alone denied, WebAuthn register/login/replay, cookie, logout, reset; live has no demo');
 }
}finally{
 await browser?.close();
 for(const child of children){if(child.exitCode===null){child.kill('SIGTERM');await new Promise(r=>{child.once('exit',r);setTimeout(()=>{child.kill('SIGKILL');r();},3000).unref();});}}
 await rm(temp,{recursive:true,force:true});
}
