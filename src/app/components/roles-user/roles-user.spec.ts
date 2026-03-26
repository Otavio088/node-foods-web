import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolesUser } from './roles-user';

describe('RolesUser', () => {
  let component: RolesUser;
  let fixture: ComponentFixture<RolesUser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RolesUser],
    }).compileComponents();

    fixture = TestBed.createComponent(RolesUser);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
