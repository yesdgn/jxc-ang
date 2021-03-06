// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  APP_CONFIG:{
   APISERVERURL:'http://192.168.31.88:3000/api',
   WEBSERVERURL : 'http://192.168.31.88:3000',
   FILEURL : 'http://192.168.31.88:3000/uploads/',
   APPID : '1000',
   APPSECRET : 'friuiowqueoikdsjkwoieuo',
   USERTYPE : '1',
   LOGINTYPE : '6',
   APPNAME :'APP后台管理系统',
   APPURL :'http://www.baidu.com',
}
};
