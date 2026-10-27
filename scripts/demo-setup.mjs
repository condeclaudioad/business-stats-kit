import {copyFile,constants} from 'node:fs/promises';
try{await copyFile('.env.example','.env.local',constants.COPYFILE_EXCL);console.log('Demo preparada. Ejecutá npm run dev y abrí http://localhost:4321.');}catch(error){if(error.code==='EEXIST')console.log('.env.local ya existe: se conserva. Revisá APP_MODE antes de ejecutar.');else throw error;}
