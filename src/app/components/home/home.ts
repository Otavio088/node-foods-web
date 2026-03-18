import { Component, inject, input } from '@angular/core';
import { User } from '../../services/user/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  userService = inject(User);
  router = inject(Router);
  userId: number = 5;
  user: any;

  prod() {
    this.router.navigateByUrl('/products');
  }
}
