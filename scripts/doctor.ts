/** Safe diagnostics: never prints secret values or provider data. No external writes. */
import {loadEnvFile} from 'node:process';
import pg from 'pg';
import {business} from '../business.config';
import {validateBusiness} from '../lib/business-validation';
import {authConfig} from '../lib/auth/config';
async function main(){
try{loadEnvFile('.env.local');}catch(e){if((e as NodeJS.ErrnoException).code!=='ENOENT')throw e;}
let failures=0;
function report(ok:boolean,label:string){console.log(`${ok?'OK':'REVISAR'} · ${label}`);if(!ok)failures++;}
const mode=process.env.APP_MODE;
report(mode==='demo'||mode==='live','APP_MODE explícito (demo o live)');
for(const issue of validateBusiness(business))report(false,issue);
if(mode==='demo')console.log('DEMO · datos ficticios; no se prueban fuentes reales.');
if(mode==='live'){
 try{authConfig();report(true,'Configuración básica de acceso');}catch{report(false,'Faltan DATABASE_URL/APP_ORIGIN válidos; no se muestran sus valores.');}
 for(const [name,configured] of [['Stripe',Boolean(process.env.STRIPE_RESTRICTED_KEY&&business.stripe.productIds.length)],['Meta',Boolean(process.env.META_ACCESS_TOKEN&&process.env.META_API_VERSION&&business.meta.accounts.length)]])console.log(`${configured?'CONFIGURADO':'OPCIONAL SIN CONFIGURAR'} · ${name}: presencia de configuración, no permisos verificados.`);
 if(process.env.META_ACCESS_TOKEN&&!/^v\d+\.\d+$/.test(process.env.META_API_VERSION??''))report(false,'Versión de Meta inválida');
 if(process.env.DATABASE_URL){try{const u=new URL(process.env.DATABASE_URL);if(!['localhost','127.0.0.1','[::1]'].includes(u.hostname))console.log('REMOTO · verificá TLS/certificado y rol mínimo con tu proveedor.');}catch{report(false,'Formato de DATABASE_URL');}}
}
if(process.argv.includes('--database')){
 if(!process.env.DATABASE_URL)report(false,'No hay base configurada para revisar');
 else {const db=new pg.Client({connectionString:process.env.DATABASE_URL,connectionTimeoutMillis:5000,query_timeout:5000});try{await db.connect();
 const q=await db.query("SELECT to_regclass('stats_auth.owner') IS NOT NULL AS auth, to_regclass('stats.events') IS NOT NULL AS events, to_regclass('stats.coverage_intervals') IS NOT NULL AS coverage");report(q.rows[0].auth,'Esquema de acceso instalado');report(q.rows[0].events&&q.rows[0].coverage,'Esquema de eventos y cobertura instalado');
 if(q.rows[0].auth){const r=await db.query('SELECT count(*)::int AS n FROM stats_auth.owner');report(r.rows[0].n===1,'Dueño configurado');}
 console.log('Lectura de esquema completada; no acredita permisos de proveedores ni Face ID físico.');
 }catch{report(false,'No se pudo leer la base/esquema. Revisá conexión y permisos en privado.');}finally{await db.end();}}
}
console.log('Nunca pegues claves ni .auth-bootstrap en un chat. Guías: docs/security.md y docs/integrations.md');
process.exitCode=failures?1:0;

}
main().catch(()=>{console.error("Diagnóstico incompleto. Revisá configuración local sin compartir secretos.");process.exitCode=1;});
