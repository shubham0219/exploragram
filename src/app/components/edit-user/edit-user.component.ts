import { Component, OnInit, NgModule } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { readAndCompressImage } from 'browser-image-resizer';
import { imageConfig } from './../../../utils/config';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css'],
})
export class EditUserComponent implements OnInit {
  uploadPercent: number = null;
  userId: any;
  userDetails: {};
  isLoading = false;
  name: any;
  bio: any;
  instaUserName: any;
  email: any;
  country: any;
  picture: string = 'assets/profileDemo.png';
  model: any;
  constructor(
    private toastr: ToastrService,
    private auth: AuthService,
    private router: Router,
    private storage: AngularFireStorage,
    private db: AngularFireDatabase,
    private route: ActivatedRoute
  ) {
    this.route.paramMap.subscribe((params) => {
      this.userId = params.get('id');
    });
    this.getUserDetails();
  }

  ngOnInit(): void {}
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
          this.instaUserName = obj['instaUserName'];
          this.email = obj['email'];
          this.country = obj['country'];
          this.picture = obj['picture'];

          this.isLoading = false;
        } else {
          this.toastr.error('No user found.');
          this.isLoading = false;
        }
      });
  }

  onSubmit() {
    this.db.object(`/users/${this.userId}`).update({
      name: this.name,
      email: this.email,
      instaUserName: this.instaUserName,
      country: this.country,
      bio: this.bio,
      picture: this.picture,
    }).then(() => {
      this.router.navigateByUrl('/');
      this.toastr.success('Profile edited successfully.');
    })
    .catch((err) => {
      this.toastr.error('Update failed.');
    });
  }

  async uploadFile(event) {
    const file = event.target.files[0];
    let resizeImage = await readAndCompressImage(file, imageConfig);
    //const filePath = file.name; //rename the image with TODO:uuid
    const filePath = file.name;
    const fileRef = this.storage.ref(filePath);

    const task = this.storage.upload(filePath, resizeImage);

    task.percentageChanges().subscribe((percentage) => {
      this.uploadPercent = percentage;
    });

    //its an observable
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            this.picture = url;
            this.toastr.success('Image upload success.');
          });
        })
      )
      .subscribe();
  }
}
