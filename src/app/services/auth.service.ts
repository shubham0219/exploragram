import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { Router } from '@angular/router';
import firebase from 'firebase/app';
import 'firebase/auth';
import { User } from './user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
user = {};
  constructor(private auth: AngularFireAuth, private router: Router,private db: AngularFireDatabase
    ) {
    this.auth.authState.subscribe((res) => {
      this.user = res;
    });
  }

  signUp(email: string, password: string) {
    return this.auth.createUserWithEmailAndPassword(email, password);
  }

  signIn(email: string, password: string) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  getUser() {
    return this.auth.authState;
  }

  signOut() {
    return this.auth.signOut();
  }



  async loginWithGoogle() {
    await this.auth
      .signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then((res) => {
        this.db.object(`/users/${res.user.uid}`).set({
          id: res.user.uid,
          name: res.additionalUserInfo.profile['name'],
          email: res.additionalUserInfo.profile['email'],
          instaUserName: '',
          country: '',
          bio: '',
          picture: res.additionalUserInfo.profile['picture'],
        });
        this.router.navigateByUrl('/');
        // console.log('loggedin');
      })
      .catch((err) => {
        console.log('error while sign in', err);
      });
  }
}
