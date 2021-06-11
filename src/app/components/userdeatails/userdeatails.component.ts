import { AuthService } from './../../services/auth.service';
import { NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-userdeatails',
  templateUrl: './userdeatails.component.html',
  styleUrls: ['./userdeatails.component.css'],
})
export class UserdeatailsComponent implements OnInit {
  userId: any;
  userDetails: {};
  isLoading = false;
  name: any;
  bio: any;
  instaUserName: any;
  email: any;
  country: any;
  picture: any;
  senderId: any;

  constructor(
    private route: ActivatedRoute,
    private db: AngularFireDatabase,
    private toastr: ToastrService,
    private auth: AuthService,
    private toast: ToastrService
  ) {
    this.auth.getUser().subscribe((user) => {
      this.senderId = user?.uid;
      console.log('UId', user);
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.userId = params.get('id');
      console.log('user', this.userId);
    });

    this.getUserDetails();
  }

  //get User Details
  getUserDetails() {
    this.db
      .object(`/users/${this.userId}`)
      .valueChanges()
      .subscribe((obj) => {
        if (obj) {
          this.userDetails = obj;
          console.log('users', this.userDetails);
          this.name = obj['name'];
          this.bio = obj['bio'];
          (this.instaUserName = obj['instaUserName']),
            (this.email = obj['email']);
          this.country = obj['country'];
          this.picture = obj['picture'];

          this.isLoading = false;
        } else {
          this.toastr.error('No user found.');
          this.isLoading = false;
        }
      });
  }

  sendMessage(f: NgForm) {
    const uid = uuidv4();
    const { message } = f.value;
    this.db
      .object(`message/${uid}`)
      .set({
        messages: message,
        mid: uid,
        recieverId: this.userId,
        senderId: this.senderId,
      })
      .then(() => {
        this.toastr.success('Message sent successfully.');
        f.reset();
      })
      .catch((err) => {
        this.toastr.error('Facing tech issues. Please try again');
        f.reset();
      });
  }
}
