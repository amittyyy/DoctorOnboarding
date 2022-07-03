// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
export const environment = {
  production: false,
  // connectionURL: 'https://api-qa.payrollrelief.com/api/v2',
  // loginURL: 'https://qa-login.accountantsoffice.com/token',
  // clientId: '6dcff889c4564a7ab615fe4ca3a286a0',
  // appName: 'ecapp'
  passwordResetURL: 'https://dev-login.accountantsoffice.com/forgot-password',
  connectionURL: 'https://dev-api.payrollrelief.com/api/v2',
  loginURL: 'https://dev-login.accountantsoffice.com/token',
  clientId: '0a5ca6862d9144479967e19f49e2b93f',
  appName: 'employeecentermobile',
  // connectionURL: 'http://api.payrollrelief.com/api/v2',
  // loginURL: 'https://login.accountantsoffice.com/token',
  // clientId: 'c2ef4ebf1ba749b6ac7dbfce917f15f7',
  // appName: 'ecapp',
};



/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
import 'zone.js/dist/zone-error';  // Included with Angular CLI.
