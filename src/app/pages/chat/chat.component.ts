import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AngularFireDatabase } from '@angular/fire/database';
import { NgForm } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {
  users = [];
  posts = [];
  isLoading = false;
  senderId;
  recievrId: any;
  messageList: any = [];
  constructor(
    private db: AngularFireDatabase,
    private toastr: ToastrService,
    private auth: AuthService,
    private route: ActivatedRoute
  ) {
    this.auth.getUser().subscribe((user) => {
      this.senderId = user?.uid;
      console.log('UId', user);
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.recievrId = params.get('id');
      console.log('rid', this.recievrId);
    });
    //  this.getAllUsers();
    //   this.getMessages();
    this.getMessages();
  }

  getMessages() {
    this.db
      .list(`/message/${this.recievrId}`)
      .valueChanges()
      .subscribe(
        (msg) => {
          // console.log('message', msg);
          this.messageList = msg;
          console.log("messageList", this.messageList);
        },
        (err) => {
          console.log(err);
        }
      );
  }

  sendMessage(f: NgForm) {
    const uid = uuidv4();
    const { message } = f.value;
    this.db
      .object(`message/${this.senderId}/${uid}`)
      .set({
        messages: message,
        mid: uid,
        recieverId: this.recievrId,
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
