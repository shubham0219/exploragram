import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { faEye, faEnvelope } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
  @Input() user;
  uid: any;
  faEye = faEye;
  faEnvelope = faEnvelope;

  constructor(private auth: AuthService, private router: Router) {
    this.auth.getUser().subscribe((user) => {
      this.uid = user?.uid;
      console.log('userId', user);
    });
  }

  gotoViewDetails(id: any) {
    this.router.navigate(['userDetails', id]);
    window.scroll(0, 0);
  }

  gotoMesssagePage(id: any){
    this.router.navigate(['inbox',id]);
  }

  ngOnInit(): void {}
}
