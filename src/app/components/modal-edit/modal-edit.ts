import { Component, inject } from '@angular/core';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RolesUserService } from '../../services/roles-user/roles-user';
import {FormBuilder, FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-modal-edit',
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule, FormsModule, ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatIconModule
  ],
  templateUrl: './modal-edit.html',
  styleUrl: './modal-edit.css',
})
export class ModalEdit {
  data = inject(MAT_DIALOG_DATA);
  screen = this.data.screen || '';
  allModules = this.data.modules || [];
  rolesUserService = inject(RolesUserService);
  roleUser: any;
  name = new FormControl(this.data.name);
  modules = new FormControl(this.data.role_user_modules);
  allRoles: any[] = [];
  options = inject(FormBuilder).group({
    name: this.name,
    modules_ids: this.modules
  });
}
