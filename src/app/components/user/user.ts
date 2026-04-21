import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user/user';
import {FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { RolesUserService } from '../../services/roles-user/roles-user';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { ModalDelete } from '../modal-delete/modal-delete';

@Component({
  selector: 'app-user',
  imports: [FormsModule, ReactiveFormsModule, MatRadioModule, MatFormFieldModule, 
    MatInputModule, MatSelectModule, MatIconModule, MatButtonModule],
  templateUrl: './user.html',
  styleUrl: './user.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class User implements OnInit {
  readonly dialog = inject(MatDialog);
  userId: number = 0;
  userName: string = '';
  name = new FormControl('');
  email = new FormControl('', [Validators.email]);
  password = new FormControl('', [Validators.minLength(6)]);
  password_confirm = new FormControl('', [Validators.minLength(6)]);
  hidePassword = signal<boolean>(true);
  hidePasswordConfirm = signal<boolean>(true);
  active = new FormControl(true);
  updated_at: string = '';
  roles = new FormControl('');
  allRoles: any[] = [];
  options = inject(FormBuilder).group({
    active: this.active,
    name: this.name,
    email: this.email,
    password: this.password,
    password_confirm: this.password_confirm,
    roles_ids: this.roles
  });
  route = inject(ActivatedRoute);
  rolesUserService = inject(RolesUserService);
  userService = inject(UserService);
  toastrService = inject(ToastrService);
  router = inject(Router);
  isEdition: boolean = false;

  ngOnInit(): void {
    this.typeScreen();
  }

  typeScreen() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');

      if (id) {
        this.isEdition = true;
        this.loadUser(Number(id));
      }

      this.getRolesUser();
    });
  }

  async getRolesUser() {
    const res = await this.rolesUserService.getAll();
    this.allRoles = res['data'] ? res['data'] : [];
  }

  async loadUser(userId: number) {
    try {
      const res = await this.userService.getOne(userId);
      const user = res && res.data ? res.data : {};
      this.setupFields(user);
    } catch (err: any) {
      this.toastrService.error(err.error.message, 'Erro', {timeOut: 2000});
      this.router.navigateByUrl('users');
    }
  }

  setupFields(user: any) {
    this.userId = user.id;
    this.userName = user.name;

    this.name.setValue(user.name);  
    this.email.setValue(user.email);
    this.password.setValue(user.password);
    this.password_confirm.setValue(user.password);
    this.roles.setValue(user.roles.map((r: any) => r.id));
  
    const active = user.active === 1 ? true : false;
    this.active.setValue(active);

    this.updated_at = new Date(user.updated_at).toLocaleString('pt-br');
  }

  passwordHide() {
    this.hidePassword.set(!this.hidePassword());
  }

  passwordHideConfirm() {
    this.hidePasswordConfirm.set(!this.hidePasswordConfirm());
  }

  async save() {
    const msg = this.fieldsValidation();

    if (msg !== '') {
      this.toastrService.warning(msg, 'Aviso', { timeOut: 2000, enableHtml: true });
      return;
    }

    let res;
    try {
      if (this.isEdition) {
        res = await this.userService.update(this.userId, this.options.value);
        const user = res && res.data ? res.data : {};
        this.setupFields(user);
      } else {
        res = await this.userService.create(this.options.value);
      }
      this.toastrService.success(res.message, 'Sucesso', {timeOut: 2000});

      if (!this.isEdition)
        this.router.navigateByUrl('users');

    } catch (err: any) {
      this.toastrService.error(err.error.message, 'Erro', {timeOut: 2000});
    }
  }

  fieldsValidation(): string {
    let msg: string = '';

    if (this.name.value === '') {
      msg += 'Nome inválido!<br>';
    }

    if (this.email.hasError('email') || this.email.value === '') {
      msg += 'E-mail inválido!<br>';
    }

    if (this.roles.value?.length === 0) {
      msg += 'Nenhum Papel selecionado!<br>';
    }

    if (this.password.hasError('minlength') || this.password.value === '') {
      msg += 'Senha inválida!<br>';
    }

    if (this.password_confirm.hasError('minlength') || this.password_confirm.value === '') {
      msg += 'Confirmação de Senha inválida!';
    }

    return msg;
  }

  async delete(userId: number, userName: string) {
    const result = this.dialog.open(ModalDelete, {
      data: {
        title: 'Excluir Usuário',
        message: `Deseja realmente excluir o Usuário ${userName}?`
      }
    });

    result.afterClosed().subscribe((res) => {
      if (res !== 'delete')
        return;

      this.userService.delete(userId).then((resDelete) => {
        this.toastrService.success(resDelete.message, 'Sucesso', { timeOut: 2000 });
        this.router.navigateByUrl('users');
      }, (errDelete) => {
        this.toastrService.error(errDelete.error.message, 'Erro', { timeOut: 2000 });
      });
    });
  }

  return() {
    this.router.navigateByUrl('users');
  }
}
