import {loadEnvFile} from 'node:process';
import {readFile} from 'node:fs/promises';
import pg from 'pg';
try{loadEnvFile('.env.local');}catch(e){if(e.code!=='ENOENT')throw e;}
if(!process.env.DATABASE_URL)throw new Error('Configurá DATABASE_URL de la base dedicada.');
const db=new pg.Client({connectionString:process.env.DATABASE_URL,connectionTimeoutMillis:5000,statement_timeout:30000});
try{await db.connect();await db.query('BEGIN');await db.query(await readFile(new URL('../db/analytics.sql',import.meta.url),'utf8'));await db.query('COMMIT');console.log('Esquema de eventos y cobertura preparado. Las filas existentes se conservan.');}catch{await db.query('ROLLBACK').catch(()=>{});console.error('No se pudo preparar la base. Revisá conexión/permisos en privado.');process.exitCode=1;}finally{await db.end();}
