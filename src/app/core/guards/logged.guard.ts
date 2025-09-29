// import { Injectable } from '@angular/core';
// import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from '@angular/router';

// import { AuthService } from '../services/auth.service';

// @Injectable({ providedIn: 'root' })
// export class Logged implements Resolve<any> {

//   constructor(
//     private authService: AuthService,
//     private router: Router
//   ) { }

//   resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
//     if (this.authService.isLogged()) {
//       this.router.navigate(['/dashboard']);
//     }
//   }
// }


// core/guards/logged.guard.ts
import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const loggedResolver: ResolveFn<boolean> = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isLogged()) {
    router.navigate(['/dashboard']);
  }
  return true;
};
