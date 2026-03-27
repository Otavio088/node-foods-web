import { ChangeDetectionStrategy, Component, inject, OnInit, ViewChild } from '@angular/core';
import { RolesUserService } from '../../services/roles-user/roles-user';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ModalDelete } from '../modal-delete/modal-delete';
import { ModalEdit } from '../modal-edit/modal-edit';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-roles-user',
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, MatIconModule, 
    MatButtonModule, FormsModule, ReactiveFormsModule, MatSelectModule],
  templateUrl: './roles-user.html',
  styleUrl: './roles-user.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RolesUser implements OnInit {
  rolesUserService = inject(RolesUserService);
  displayedColumns: string[] = ['name', 'modules_names', 'created_at', 'updated_at', 'actions'];
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  readonly dialog = inject(MatDialog);
  toastrService = inject(ToastrService);
  allModules: any[] = [];
  name = new FormControl('');
  modules = new FormControl('');
  allRoles: any[] = [];
  dataNewRoleUser = inject(FormBuilder).group({
    name: this.name,
    modules_ids: this.modules
  });

  async ngOnInit(): Promise<void> {
    await this.getRolesUser();
    await this.getModules();
  }

  async getRolesUser() {
    const res = await this.rolesUserService.getAll();
    const rolesUser = res.data ? res.data.map((d: any) => ({
      ...d, updated_at_formatted: new Date(d.updated_at).toLocaleString('pt-br'),
        created_at_formatted: new Date(d.created_at).toLocaleString('pt-br'),
        modules_names: d.modules.map((m: any) => m.name).join(', ')
    })) : [];

    this.setupTableData(rolesUser);
  }

  setupTableData(rolesUser: any) {
    this.dataSource = new MatTableDataSource(rolesUser);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  async getModules() {
    const res = await this.rolesUserService.getModules();
    this.allModules = res.data ? res.data : [];
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  async create() {
    const msg = this.fieldsValidation();

    if (msg !== '') {
      this.toastrService.warning(msg, 'Aviso', { timeOut: 2000, enableHtml: true });
      return;
    }

    try {
      const res = await this.rolesUserService.create(this.dataNewRoleUser.value);
      this.toastrService.success(res.message, 'Sucesso', {timeOut: 2000});
      this.getRolesUser();
    } catch (err: any) {
      this.toastrService.error(err.error.message, 'Erro', {timeOut: 2000});
    }
  }

  fieldsValidation(): string {
    let msg: string = '';

    if (this.name.value === '') {
      msg += 'Nome inválido!<br>';
    }

    if (this.modules.value?.length === 0) {
      msg += 'Nenhum módulo foi selecionado!';
    }

    return msg;
  }

  edit(roleUserId: number, roleUserName: string, roleUserModules: any) {
    const result = this.dialog.open(ModalEdit, {
      data: {
        screen: 'roles-user',
        title: 'Editar Tipo de Usuário',
        name: roleUserName,
        id: roleUserId,
        role_user_modules: roleUserModules.map((m: any) => m.id),
        modules: this.allModules
      }
    });

    result.afterClosed().subscribe((res) => {
      if (!res || !res.type || res.type !== 'update') {
        return;
      }

      this.rolesUserService.update(roleUserId, res.data).then((resUpdate) => {
        this.getRolesUser();
        this.toastrService.success(resUpdate.message, 'Sucesso', { timeOut: 2000 });
      }, (errUpdate) => {
        this.toastrService.error(errUpdate.error.message, 'Erro', { timeOut: 2000 });
      });
    });
  }

  async delete(roleUserId: number, roleUserName: string) {
    const result = this.dialog.open(ModalDelete, {
      data: {
        title: 'Excluir Tipo de Usuário',
        message: `Deseja realmente excluir o Tipo ${roleUserName}?`
      }
    });

    result.afterClosed().subscribe((res) => {
      if (res !== 'delete') {
        return;
      }

      this.rolesUserService.delete(roleUserId).then((resDelete) => {
        this.getRolesUser();
        this.toastrService.success(resDelete.message, 'Sucesso', { timeOut: 2000 });
      }, (errDelete) => {
        this.toastrService.error(errDelete.error.message, 'Erro', { timeOut: 2000 });
      });
    });
  }
}
