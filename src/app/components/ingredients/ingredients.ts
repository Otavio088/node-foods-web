import { ChangeDetectionStrategy, Component, inject, OnInit, ViewChild } from '@angular/core';
import { IngredientsService } from '../../services/ingredients/ingredients';
import { UnitTypesService } from '../../services/unit-types/unit-types';
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
  selector: 'app-ingredients',
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, MatIconModule, 
    MatButtonModule, FormsModule, ReactiveFormsModule, MatSelectModule],
  templateUrl: './ingredients.html',
  styleUrl: './ingredients.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Ingredients implements OnInit {
  ingredientsService = inject(IngredientsService);
  unitTypesService = inject(UnitTypesService);
  displayedColumns: string[] = ['name', 'unit_type_name', 'created_at', 'updated_at', 'actions'];
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  readonly dialog = inject(MatDialog);
  toastrService = inject(ToastrService);
  allUnitTypes: any[] = [];
  name = new FormControl('');
  unitType = new FormControl('');
  dataNewIngredient = inject(FormBuilder).group({
    name: this.name,
    unit_type_id: this.unitType
  });

  async ngOnInit(): Promise<void> {
    await this.getIngredients();
    await this.getUnitTypes();
  }

  async getIngredients() {
    const res = await this.ingredientsService.getAll();
    const ingredients = res.data ? res.data.map((d: any) => ({
      ...d, updated_at: new Date(d.updated_at).toLocaleString('pt-br'),
        created_at: new Date(d.created_at).toLocaleString('pt-br'),
        unit_type_name: `${d.unit_type.name} (${d.unit_type.type})`
    })) : [];

    this.setupTableData(ingredients);
  }

  setupTableData(rolesUser: any) {
    this.dataSource = new MatTableDataSource(rolesUser);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  async getUnitTypes() {
    const res = await this.unitTypesService.getAll();
    this.allUnitTypes = res.data ? res.data : [];
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
      const res = await this.ingredientsService.create(this.dataNewIngredient.value);
      this.toastrService.success(res.message, 'Sucesso', {timeOut: 2000});
      this.getIngredients();
    } catch (err: any) {
      this.toastrService.error(err.error.message, 'Erro', {timeOut: 2000});
    }
  }

  fieldsValidation(): string {
    let msg: string = '';

    if (this.name.value === '') {
      msg += 'Nome inválido!<br>';
    }

    if (this.unitType.value === '') {
      msg += 'Nenhuma Únidade de Medida foi selecionada!';
    }

    return msg;
  }

  edit(ingredientId: number, ingredientName: string, unitTypeId: number) {
    const result = this.dialog.open(ModalEdit, {
      data: {
        screen: 'ingredients',
        title: 'Editar Ingrediente',
        name: ingredientName,
        id: ingredientId,
        unit_type_id: unitTypeId,
        unit_types: this.allUnitTypes
      }
    });

    result.afterClosed().subscribe((res) => {
      if (!res || !res.type || res.type !== 'update')
        return;

      this.ingredientsService.update(ingredientId, res.data).then((resUpdate) => {
        this.getIngredients();
        this.toastrService.success(resUpdate.message, 'Sucesso', { timeOut: 2000 });
      }, (errUpdate) => {
        this.toastrService.error(errUpdate.error.message, 'Erro', { timeOut: 2000 });
      });
    });
  }

  async delete(ingredientId: number, ingredientName: string) {
    const result = this.dialog.open(ModalDelete, {
      data: {
        title: 'Excluir Ingrediente?',
        message: `Deseja realmente excluir ${ingredientName}?`
      }
    });

    result.afterClosed().subscribe((res) => {
      if (res !== 'delete')
        return;

      this.ingredientsService.delete(ingredientId).then((resDelete) => {
        this.getIngredients();
        this.toastrService.success(resDelete.message, 'Sucesso', { timeOut: 2000 });
      }, (errDelete) => {
        this.toastrService.error(errDelete.error.message, 'Erro', { timeOut: 2000 });
      });
    });
  }
}
