import { Component, OnInit } from '@angular/core';
import {
  AbstractControl, FormBuilder, FormControl, FormGroupDirective, FormGroup,
  NgForm, Validators, ValidationErrors, ValidatorFn
} from '@angular/forms';
import { Subscription } from 'rxjs';

import { AuthService } from '../../core/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { SignupRequest } from '../interfaces/signup.interface';
import { MessageService } from 'primeng/api';


@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./../login/login.component.scss'],
    standalone: true,
    imports: [SharedModule],
    providers: [MessageService]
})
export class RegisterComponent implements OnInit {
  form!: FormGroup;
  registerSubscription!: Subscription;
  loading = false;
  selectedPlan = 'free'; // Plan por defecto

  constructor(
    private authService: AuthService,
    public formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) {
    this.initFormBuilder();
  }

  ngOnInit() {
    // Obtener plan desde query params (viene del landing)
    this.route.queryParams.subscribe(params => {
      if (params['plan']) {
        this.selectedPlan = params['plan'];
        console.log('Plan seleccionado desde landing:', this.selectedPlan);
      }
    });
  }

  registerUser() {
    if (this.form.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Formulario Inválido',
        detail: 'Por favor complete todos los campos correctamente'
      });
      return;
    }

    this.loading = true;

    // Sprint 2: Usar endpoint de signup
    const signupRequest: SignupRequest = {
      org_name: this.form.value.orgName,
      admin_email: this.form.value.email,
      admin_password: this.form.value.password,
      admin_full_name: this.form.value.fullName,
      plan_code: this.selectedPlan.toUpperCase()
    };

    this.registerSubscription = this.authService
      .signup(signupRequest)
      .subscribe({
        next: (response) => {
          console.log("Signup exitoso:", response);
          this.messageService.add({
            severity: 'success',
            summary: 'Registro Exitoso',
            detail: `Bienvenido a ${response.data.plan.name}`
          });
          
          // Redirigir al dashboard después de 1.5 segundos
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 1500);
        },
        error: (error) => {
          console.error('Error en signup:', error);
          this.loading = false;
          
          let errorMessage = 'Error al registrar la organización';
          if (error.error?.message) {
            errorMessage = error.error.message;
          } else if (error.status === 409) {
            errorMessage = 'El email ya está registrado';
          } else if (error.status === 0) {
            errorMessage = 'No se pudo conectar con el servidor';
          }

          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: errorMessage
          });
        },
        complete: () => {
          this.loading = false;
        }
      });
  }

  private initFormBuilder() {
    this.form = this.formBuilder.group({
      orgName: ['', [Validators.required, Validators.minLength(3)]],
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ]],
      password: ['', [
        Validators.required,
        this.regexValidator(new RegExp('(?=.*?[0-9])'), { 'at-least-one-digit': true }),
        this.regexValidator(new RegExp('(?=.*[a-z])'), { 'at-least-one-lowercase': true }),
        this.regexValidator(new RegExp('(?=.*[A-Z])'), { 'at-least-one-uppercase': true }),
        this.regexValidator(new RegExp('(?=.*[!@#$%^&*])'), { 'at-least-one-special-character': true }),
        this.regexValidator(new RegExp('(^.{8,}$)'), { 'at-least-eight-characters': true }),
      ]],
      passwordConfirmation: ['', Validators.required]
    }, { validator: this.checkPasswords });
  }

  private checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    const pass = group.controls['password'].value;
    const confirmPass = group.controls['passwordConfirmation'].value;
    return pass === confirmPass ? null : { notSame: true };
  }

  private regexValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!control.value) {
        return null;
      }
      const valid = regex.test(control.value);
      return valid ? null : error;
    };
  }
}
