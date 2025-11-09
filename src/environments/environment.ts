// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  backend: {
    host: 'http://localhost:4646/api',
    host3: '',
    host4: '',
    reportes: '',
  },
  oauth: {
    host: 'http://localhost:8585/api',
    host3: 'http://localhost:8585/api',
    host4: 'http://207.244.229.255:8510/api',
    client_id: '2',
    client_secret: 'tsN80QNwTawD3WZSX2uziOFI6HstTEs2bXBqsCyv',
    scope: '*',
  },
  movieDB: {
    host: 'http://api.themoviedb.org/3',
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
