import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

import { faInbox } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  email = null;
  id : any;
  faInbox = faInbox;

  constructor(
    private auth: AuthService,
    private router: Router,
    private toastr: ToastrService,
  ) {
    auth.getUser().subscribe((user) => {
      console.log("USER IS:", user);
      this.email = user?.email;
      this.id = user?.uid;
    });
  }

  ngOnInit(): void {
  }

  async handleSignOut() {
    try {
      await this.auth.signOut();
      this.router.navigateByUrl("/signin");
      this.toastr.info("Logout success");
      this.email = null;
    } catch (error) {
      this.toastr.error("Problem in signout");
    }
  }

  gotoEditProfile(){
    this.router.navigate(['/edituser', this.id]);
    window.scroll(0, 0);
    }

    messageRead(){
      console.log("clicked");

    }
}
