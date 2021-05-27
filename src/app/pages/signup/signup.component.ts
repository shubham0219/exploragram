import { imageConfig } from './../../../utils/config';
import { AuthService } from './../../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';

//form
import { NgForm } from '@angular/forms';

//rxjs
import { finalize } from 'rxjs/operators';

//firebase
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireDatabase } from '@angular/fire/database';

//browser image resizer
import { readAndCompressImage } from 'browser-image-resizer';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  uploadPercent: number = null;
  constructor(
    private toastr: ToastrService,
    private auth: AuthService,
    private router: Router,
    private storage: AngularFireStorage,
    private db: AngularFireDatabase
  ) {}

  picture: string = 'assets/profileDemo.png';
  ngOnInit(): void {}

  onSubmit(f: NgForm) {
    //following is called destructuring
    const { email, password, username, country, bio, name } = f.form.value;
    this.auth
      .signUp(email, password)
      .then((res) => {
        console.log(res);
        const { uid } = res.user;
        this.db.object(`/users/${uid}`).set({
          id: uid,
          name: name,
          email: email,
          instaUserName: username,
          country: country,
          bio: bio,
          picture: this.picture,
        });
      })
      .then(() => {
        this.router.navigateByUrl('/');
        this.toastr.success('SignUp success.');
      })
      .catch((err) => {
        this.toastr.error('SignUp failed.');
        console.log(err);
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
