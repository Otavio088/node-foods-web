import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDelete } from './modal-delete';

describe('ModalDelete', () => {
  let component: ModalDelete;
  let fixture: ComponentFixture<ModalDelete>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalDelete],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalDelete);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
