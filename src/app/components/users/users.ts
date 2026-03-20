import { Component, inject, ViewChild } from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { User } from '../../services/user/user';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-users',
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, MatIcon, MatButtonModule],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users {
  displayedColumns: string[] = ['id', 'name', 'email', 'created_at', 'active', 'actions'];
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  userService = inject(User);

  async ngOnInit(): Promise<void> {
    await this.setupTableData();
  }

  async setupTableData() {
    const res = await this.userService.getAll();
    const users = res.data ? res.data.map((d: any) => ({
      ...d, created_at_formatted: new Date(d.created_at).toLocaleDateString()
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
}
