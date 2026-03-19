import { Component, inject, input, output, signal } from '@angular/core';
import { FormControl, FormGroupDirective, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';
import { Auth } from '../../services/auth/auth';
import { Router } from '@angular/router';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-login',
  imports: [FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatButtonModule, MatIconModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})

export class Login {
  email = new FormControl('', [Validators.email]);
  password = new FormControl('', [Validators.minLength(6)]);
  matcher = new MyErrorStateMatcher();
  hidePassword = signal<boolean>(true);
  http = inject(HttpClient);
  authService = inject(Auth);
  router = inject(Router);
  isLogin = input<boolean>(true);

  passwordHide() {
    this.hidePassword.set(!this.hidePassword());
  }

  async loginUser() {
    const data = {
      email: this.email.value,
      password: this.password.value
    }

    try {
      await this.authService.loginUser(data);
      this.router.navigateByUrl('/home');
    } catch (err) {
      console.log('err: ', err);
      return;
    }
  }

}
