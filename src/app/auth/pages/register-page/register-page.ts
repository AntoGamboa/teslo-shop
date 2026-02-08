import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from "@angular/router";
import { UserRegister } from '@auth/interfaces/user.register.interface';
import { AuthService } from '@auth/services/auth.service';

@Component({
  selector: 'app-register-page',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register-page.html',
})
export class RegisterPage {
  authService = inject(AuthService);
  fb = inject(FormBuilder);
  hasError = signal(false);
  hasSucces = signal(false);
  router = inject(Router);
  formGroup = this.fb.group({
    email:['',[Validators.required,Validators.email]],
    fullName:['',[Validators.required,Validators.minLength(3)]],
    password:['',[Validators.required,Validators.minLength(8)]]
  });

  onSubmit(){
    if(this.formGroup.invalid){
      this.hasError.set(true);
      setTimeout(() => {
        this.hasError.set(false)
      }, 3000);
    }

    const registerData = this.formGroup.value as UserRegister
    this.authService.register(registerData)
    .subscribe(
      resp =>{
        if(resp){
          this.hasSucces.set(true)
          setTimeout(() => {
            this.router.navigateByUrl('/auth/login');

          }, 1500);
          return
        }
        this.hasError.set(true);

      }
    )




  }

}
