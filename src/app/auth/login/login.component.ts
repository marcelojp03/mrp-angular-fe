import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { AuthService } from '../../core/services/auth.service';
import { SharedModule } from '../../shared/shared.module';
import { AppFloatingConfigurator } from '../../core/layouts/component/app.floatingconfigurator';
import { MessageService } from 'primeng/api';
import { LoginSuccessResponse, LoginErrorResponse } from '../interfaces/auth.interface';
// import { DashboardComponent } from '../../dashboard/dashboard.component';
// import {ToastrService} from 'ngx-toastr'
// import { BitacoraService } from 'src/app/dashboard/bitacora/bitacora.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    standalone: true,
    imports: [AppFloatingConfigurator, SharedModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [MessageService]
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  message!: string;
  loginSubscription!: Subscription;
  loginLoading = false;
  checked: boolean = false;
  submitted = false;
  static path = () => ['login'];

  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide);
    event.stopPropagation();
  }

  constructor(
    private authService: AuthService,
    // private bitacoraService:BitacoraService,
    public formBuilder: FormBuilder,
    private router: Router,
    private messageService: MessageService
  ) {
    this.initFormBuilder();
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.loginSubscription?.unsubscribe();
  }

  private initFormBuilder() {
    this.form = this.formBuilder.group({
      email:new FormControl({ value: '', disabled: false }, [Validators.required, Validators.email]),
      password:new FormControl({ value: '', disabled: false }, Validators.required),
      rememberMe : new FormControl(false)
    })
  }

  control(name: keyof typeof this.form.controls): AbstractControl {
    return this.form.get(name as string)!;
  }

  showError(name: string, errorKey: string): boolean {
    const ctrl = this.form.get(name);
    return !!ctrl && ctrl.invalid && (ctrl.touched || this.submitted) && !!ctrl.errors?.[errorKey];
  }


  loginUser() {
    this.submitted = true;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, password, rememberMe } = this.form.value;
    this.loginLoading = true;
    this.form.disable();

    // Opcional: recordar email
    if (rememberMe) localStorage.setItem('remembered_email', email);
    else localStorage.removeItem('remembered_email');

    this.loginSubscription = this.authService
      .loginWithUserCredentials(email, password)
      .pipe(finalize(() => {
        this.loginLoading = false;
        this.form.enable();
      }))
      .subscribe({
        next: (response: LoginSuccessResponse | LoginErrorResponse) => {
          console.info("LOGIN RESPONSE: ", response);
          
          if (response.success) {
            const successResponse = response as LoginSuccessResponse;
            
            // Save authentication data using the new service method
            this.authService.saveAuthData(successResponse);

            // Success message
            this.messageService.add({
              key: 'br',
              severity: 'success',
              summary: 'Sesión iniciada correctamente',
              detail: `Bienvenido, ${successResponse.data.user.name}`,
              life: 3500
            });

            // Redirect after a brief delay to show the toast
            setTimeout(() => this.router.navigateByUrl('/dashboard'), 1500);
          } else {
            const errorResponse = response as LoginErrorResponse;
            const msg = errorResponse.message || 'Credenciales inválidas';
            
            this.messageService.add({
              key: 'br',
              severity: 'error',
              summary: 'Error de autenticación',
              detail: msg,
              life: 3000
            });
          }
        },
        error: (error: any) => {
          this.messageService.add({
            key: 'br',
            severity: 'error',
            summary: 'Error de conexión',
            detail: 'No se pudo conectar con el servidor',
            life: 3000
          });
          console.error("ERROR AL INICIAR SESION", error);
        }
      });
  }

}
