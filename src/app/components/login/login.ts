import { Component, inject, input, signal } from '@angular/core';
import { FormControl, FormGroupDirective, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Auth } from '../../services/auth/auth';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

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
  authService = inject(Auth);
  router = inject(Router);
  toastrService = inject(ToastrService);
  email = new FormControl('', [Validators.email]);
  password = new FormControl('', [Validators.minLength(6)]);
  matcher = new MyErrorStateMatcher();
  hidePassword = signal<boolean>(true);
  isLogin = input<boolean>(true);

  passwordHide() {
    this.hidePassword.set(!this.hidePassword());
  }

  async loginUser() {
    let msg = this.fieldsValidation();

    if (msg !== '') {
      this.toastrService.warning(msg, 'Aviso', { timeOut: 2000, enableHtml: true });
      return;
    }

    const data = {
      email: this.email.value,
      password: this.password.value
    }

    try {
      const user = await this.authService.loginUser(data);
      this.toastrService.success(user.message, 'Sucesso', { timeOut: 2000 });
      this.router.navigateByUrl('/home');
    } catch (err: any) {
      this.toastrService.error(err.error.message, 'Erro', { timeOut: 2000 });
    }
  }

  fieldsValidation(): string {
    let msg: string = '';

    if (this.email.hasError('email') || this.email.value === '') {
      msg += 'E-mail inválido!<br>';
    }

    if (this.password.hasError('minlength') || this.password.value === '') {
      msg += 'Senha inválida!';
    }

    return msg;
  }
}
