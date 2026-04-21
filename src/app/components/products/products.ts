import { ChangeDetectionStrategy, Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ProductService } from '../../services/product/product';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ModalDelete } from '../modal-delete/modal-delete';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products',
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, MatIcon, MatButtonModule],
  templateUrl: './products.html',
  styleUrl: './products.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Products implements OnInit {
  readonly dialog = inject(MatDialog);
  toastrService = inject(ToastrService);
  router = inject(Router);
  displayedColumns: string[] = ['id', 'name', 'price', 'created_at', 'actions'];
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  productService = inject(ProductService);

  async ngOnInit(): Promise<void> {
    await this.getProducts();
  }

  async getProducts() {
    const res = await this.productService.getAll();
    const users = res.data ? res.data.map((d: any) => ({
      ...d, created_at: new Date(d.created_at).toLocaleString('pt-br'),
        price: d.price.replace('.', ',')
    })) : [];

    this.setupTableData(users);
  }

  async setupTableData(users: any) {
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

  edit(id: number) {
    this.router.navigateByUrl(`products/${id}`);
  }

  async delete(id: number, name: string) {
    const result = this.dialog.open(ModalDelete, {
      data: {
        title: 'Excluir Produto',
        message: `Deseja realmente excluir o Produto ${name}?`
      }
    });

    result.afterClosed().subscribe((res) => {
      if (res !== 'delete') {
        return;
      }

      this.productService.delete(id).then((resDelete) => {
        this.getProducts();
        this.toastrService.success(resDelete.message, 'Sucesso', { timeOut: 2000 });
      }, (errDelete) => {
        this.toastrService.error(errDelete.error.message, 'Erro', { timeOut: 2000 });
      });
    });
  }
}
