import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
  @Input() user;
  uid: any;

  constructor(private auth: AuthService) {
    this.auth.getUser().subscribe((user) => {
      this.uid = user?.uid;
      console.log('userId', user);
    });
  }

  ngOnInit(): void {}
}
