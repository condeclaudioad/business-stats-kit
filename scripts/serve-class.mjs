import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {resolve,sep,extname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(fileURLToPath(new URL('../class/',import.meta.url)));
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.ttf':'font/ttf','.woff2':'font/woff2','.md':'text/plain; charset=utf-8','.json':'application/json'};
http.createServer(async(req,res)=>{
 try{
  if(req.method!=='GET'&&req.method!=='HEAD'){res.writeHead(405);res.end();return;}
  const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  let file=resolve(root,'.'+pathname);if(file!==root&&!file.startsWith(root+sep))throw Error();
  if((await stat(file)).isDirectory())file=resolve(file,'index.html');
  if(!file.startsWith(root+sep)&&file!==resolve(root,'index.html'))throw Error();
  const data=await readFile(file);res.writeHead(200,{'Content-Type':types[extname(file)]??'application/octet-stream','X-Content-Type-Options':'nosniff','Cache-Control':'no-store'});res.end(req.method==='HEAD'?undefined:data);
 }catch{res.writeHead(404,{'Content-Type':'text/plain'});res.end('Archivo no encontrado');}
}).listen(4324,'127.0.0.1',()=>console.log('Clase: http://127.0.0.1:4324 · Ctrl+C para cerrar. Solo acceso local.'));
