import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user/user';
import {FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { RolesUserService } from '../../services/roles-user/roles-user';

@Component({
  selector: 'app-user',
  imports: [FormsModule, ReactiveFormsModule, MatCheckboxModule, MatRadioModule, MatFormFieldModule, 
    MatInputModule, MatSelectModule, MatIconModule, MatButtonModule],
  templateUrl: './user.html',
  styleUrl: './user.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class User implements OnInit {
  name = new FormControl('');
  email = new FormControl('');
  password = new FormControl('', [Validators.minLength(6)]);
  password_confirm = new FormControl('', [Validators.minLength(6)]);
  hidePassword = signal<boolean>(true);
  hidePasswordConfirm = signal<boolean>(true);
  active = new FormControl(true);
  updated_at = new FormControl('');
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
  idEdition: boolean = false;

  ngOnInit(): void {
    this.typeScreen();
  }

  typeScreen() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');

      if (id) {
        this.idEdition = true;
        this.getRolesUser();
        this.loadUser(Number(id));
      }
    });
  }

  async getRolesUser() {
    const res = await this.rolesUserService.getAll();
    this.allRoles = res['data'] ? res['data'] : [];
  }

  async loadUser(userId: number) {
    const res = await this.userService.getOne(userId);
    const user = res && res.data ? res.data : {};

    this.name.setValue(user.name);  
    this.email.setValue(user.email);
    this.password.setValue(user.password);
    this.password_confirm.setValue(user.password);
    this.updated_at.setValue(new Date(user.updated_at).toLocaleDateString('pt-br'));
    this.updated_at.disable();
    this.roles.setValue(user.roles.map((r: any) => r.id));

    const active = user.active === 1 ? true : false;
    this.active.setValue(active);
  }

  passwordHide() {
    this.hidePassword.set(!this.hidePassword());
  }

  passwordHideConfirm() {
    this.hidePasswordConfirm.set(!this.hidePasswordConfirm());
  }

  update() {
    console.log('this.options: ', this.options.value);
  }

}
