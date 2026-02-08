const {writeFileSync,mkdirSync} = require('fs')
require('dotenv').config();

const TargetDir = './src/environments'
const TargetPath = './src/environments/environment.ts'
const TargetPathenv = './src/environments/environment.development.ts'

if(!process.env['API_BASE_URL']){
  throw new Error('API_BASE_URL IS NOT SET');
}

const envFileContent = `
  export const environment = {
  apiBaseUrl:'${process.env['API_BASE_URL']}',
};`

mkdirSync(TargetDir,{recursive:true});

writeFileSync(TargetPath,envFileContent);
writeFileSync(TargetPathenv,envFileContent);



