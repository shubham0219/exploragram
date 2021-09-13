import { ChatComponent } from '../app/pages/chat/chat.component';
import { EditUserComponent } from './components/edit-user/edit-user.component';
import { UserdeatailsComponent } from './components/userdeatails/userdeatails.component';
import { SignupComponent } from './pages/signup/signup.component';
import { SigninComponent } from './pages/signin/signin.component';
import { HomeComponent } from './pages/home/home.component';
import { PagenotfoundComponent } from './pages/pagenotfound/pagenotfound.component';
import { AddpostComponent } from './pages/addpost/addpost.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {
  AngularFireAuthGuard,
  redirectUnauthorizedTo,
  redirectLoggedInTo,
} from '@angular/fire/auth-guard';
import { signupDeactivateGuardService } from './pages/signup/signup-candeactivate-guard.service';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(["signin"]);
const redirectLoggedInToHome = () => redirectLoggedInTo([""]);

const routes: Routes = [
  {
    path: "signin",
    component: SigninComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectLoggedInToHome },
  },
  {
    path: "signup",
    component: SignupComponent,
    canDeactivate : [signupDeactivateGuardService],
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectLoggedInToHome },
  },
  {
    path: "addpost",
    component: AddpostComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
  {
    path: "",
    component: HomeComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
  {
    path: "userDetails/:id",
    component: UserdeatailsComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
  {
    path: "edituser/:id",
    component: EditUserComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
  // {
  //   path: "inbox",
  //   component: ChatComponent,
  //   canActivate: [AngularFireAuthGuard],
  // },
  {
    path: "inbox/:id",
    component: ChatComponent,
    canActivate: [AngularFireAuthGuard],
  },

  {
    path: "**",
    component: PagenotfoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
