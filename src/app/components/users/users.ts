import { ChangeDetectionStrategy, Component, inject, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { UserService } from '../../services/user/user';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ModalDelete } from '../modal-delete/modal-delete';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, MatIcon, MatButtonModule, 
    MatButtonModule],
  templateUrl: './users.html',
  styleUrl: './users.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Users {
  readonly dialog = inject(MatDialog);
  toastrService = inject(ToastrService);
  router = inject(Router);
  displayedColumns: string[] = ['id', 'name', 'email', 'created_at', 'active', 'actions'];
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  userService = inject(UserService);

  async ngOnInit(): Promise<void> {
    await this.setupTableData();
  }

  async setupTableData() {
    const res = await this.userService.getAll();
    const users = res.data ? res.data.map((d: any) => ({
      ...d, created_at_formatted: new Date(d.created_at).toLocaleDateString('pt-br')
    })) : [];

    this.dataSource = new MatTableDataSource(users);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  edit(userId: number) {
    this.router.navigateByUrl(`user/${userId}`);
  }

  async delete(userId: number, userName: string) {
    const result = this.dialog.open(ModalDelete, {
      data: {
        title: 'Excluir Usuário',
        message: `Deseja realmente excluir o Usuário ${userName}?`
      }
    });

    result.afterClosed().subscribe((res) => {
      if (res !== 'delete') {
        return;
      }

      this.userService.delete(userId).then((resDelete) => {
        this.setupTableData();
        this.toastrService.success(resDelete.message, 'Sucesso', { timeOut: 2000 });
      }, (errDelete) => {
        this.toastrService.error(errDelete.error.message, 'Erro', { timeOut: 2000 });
      });
    });
  }

}
