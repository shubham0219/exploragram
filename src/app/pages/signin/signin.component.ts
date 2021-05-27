import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
})
export class SigninComponent implements OnInit {
  constructor(
    private toastr: ToastrService,
    private auth: AuthService,
    private router: Router
  ) {}
  ngOnInit(): void {}

  onSubmit(f: NgForm) {
    const { email, password } = f.form.value;

    this.auth.signIn(email, password)
    .then((res)=>{
      this.toastr.success("Sign In success",'', {
        closeButton: true
      });
      this.router.navigateByUrl('/');
    })
    .catch((err)=>{
      this.toastr.error(err.message, '', {
        closeButton: true
      });
    });
  }
}
