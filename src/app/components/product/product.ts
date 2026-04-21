import { ChangeDetectionStrategy, Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product/product';
import { IngredientsService } from '../../services/ingredients/ingredients';
import { AuthService } from '../../services/auth/auth';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { ModalDelete } from '../modal-delete/modal-delete';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';

@Component({
  selector: 'app-product',
  imports: [FormsModule, ReactiveFormsModule, MatRadioModule, MatFormFieldModule, 
    MatInputModule, MatSelectModule, MatIconModule, MatButtonModule, MatTableModule, MatSortModule, MatPaginatorModule],
  templateUrl: './product.html',
  styleUrl: './product.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Product implements OnInit {
  readonly dialog = inject(MatDialog);
  ingredientsService = inject(IngredientsService);
  productService = inject(ProductService);
  authService = inject(AuthService);
  route = inject(ActivatedRoute);
  toastrService = inject(ToastrService);
  router = inject(Router);
  name = new FormControl('');
  description = new FormControl('');
  price = new FormControl(0.00);
  ingredients = new FormControl([]);
  user: any = {};
  ingredientsSelect = new FormControl('');
  options = inject(FormBuilder).group({
    name: this.name,
    description: this.description,
    price: this.price,
    ingredientSelect: this.ingredientsSelect,
    ingredients: this.ingredients,
    user_id: this.user.id
  });
  displayedColumns: string[] = ['name', 'quantity', 'actions'];
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  productId: number = 0;
  productName: string = '';
  updated_at: string = '';
  allIngredients: any[] = [];
  ingredientsSelected: any[] = [];
  isEdition: boolean = false;

  ngOnInit(): void {
    this.getUserLogged();
    this.typeScreen();
  }

  getUserLogged() {
    this.user = this.authService.getUser();
  }

  typeScreen() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');

      if (id) {
        this.isEdition = true;
        this.loadProduct(Number(id));
      }

      this.getIngredients();
    });
  }

  async getIngredients() {
    const res = await this.ingredientsService.getAll();
    this.allIngredients = res['data'] ? res['data'] : [];
  }

  async loadProduct(id: number) {
    try {
      const res = await this.productService.getOne(id);
      const product = res && res.data ? res.data : {};
      this.setupFields(product);
      this.setupTableData(product);
    } catch (err: any) {
      this.toastrService.error(err.error.message, 'Erro', {timeOut: 2000});
      this.router.navigateByUrl('products');
    }
  }

  setupFields(product: any) {
    this.productId = product.id;
    this.productName = product.name;

    this.name.setValue(product.name);
    this.description.setValue(product.description);
    this.price.setValue(product.price);
    const ingredientsIds = product.ingredients.map((i: any) => i.id);
    this.ingredients.setValue(product.ingredients);
    this.updated_at = new Date(product.updated_at).toLocaleString('pt-br');
  }

  setupTableData(product: any) {
    console.log('product: ', product);
    const ingredients = product.ingredients || [];
    this.dataSource = new MatTableDataSource(ingredients);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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
        res = await this.productService.update(this.productId, this.options.value);
        const product = res && res.data ? res.data : {};
        this.setupFields(product);
      } else {
        res = await this.productService.create(this.options.value);
      }

      this.toastrService.success(res.message, 'Sucesso', {timeOut: 2000});

      if (!this.isEdition)
        this.router.navigateByUrl('products');

    } catch (err: any) {
      this.toastrService.error(err.error.message, 'Erro', {timeOut: 2000});
    }
  }

  fieldsValidation(): string {
    let msg: string = '';

    if (this.name.value === '') {
      msg += 'Nome inválido!<br>';
    }

    if (!this.price.value || this.price.value === 0.00) {
      msg += 'Preço inválido!<br>';
    }

    return msg;
  }

  async delete() {
    const result = this.dialog.open(ModalDelete, {
      data: {
        title: 'Excluir Produto',
        message: `Deseja realmente excluir o Produto ${this.productName}?`
      }
    });

    result.afterClosed().subscribe((res) => {
      if (res !== 'delete')
        return;

      this.productService.delete(this.productId).then((resDelete) => {
        this.toastrService.success(resDelete.message, 'Sucesso', { timeOut: 2000 });
        this.router.navigateByUrl('products');
      }, (errDelete) => {
        this.toastrService.error(errDelete.error.message, 'Erro', { timeOut: 2000 });
      });
    });
  }

  return() {
    this.router.navigateByUrl('products');
  }
}
