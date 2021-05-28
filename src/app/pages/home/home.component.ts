import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AngularFireDatabase } from '@angular/fire/database';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  users = [];
  posts = [];

  isLoading = false;

  constructor(
    private db: AngularFireDatabase,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.isLoading = true;
    this.getAllUsers();
    this.getAllPosts();
  }

  ngOnInit(): void {}

  //get all the users
  getAllUsers() {
    this.db
      .object('/users')
      .valueChanges()
      .subscribe((obj) => {
        if (obj) {
          this.users = Object.values(obj);
          console.log('users', this.users);

          this.isLoading = false;
        } else {
          this.toastr.error('No user found.');
          this.users = [];
          this.isLoading = false;
        }
      });
  }

  //get all posts
  getAllPosts() {
    //grab Posts from DB
    this.db
      .object('/posts')
      .valueChanges()
      .subscribe((obj) => {
        if (obj) {
          this.posts = Object.values(obj).sort((a, b) => b.date - a.date);
          this.isLoading = false;
        } else {
          this.toastr.error('No posts to display.');
          this.posts = [];
          this.isLoading = false;
        }
      });
  }

  gotoViewDetails(id: any) {
    this.router.navigate(['userDetails', id]);
    window.scroll(0, 0);
  }
}
