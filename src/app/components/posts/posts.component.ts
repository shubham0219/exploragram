import { AngularFireDatabase } from '@angular/fire/database';
import { AuthService } from './../../services/auth.service';
import { Component, Input, OnChanges, OnInit } from '@angular/core';

import {
  faThumbsUp,
  faThumbsDown,
  faShareSquare,
  faTrashAlt,
} from '@fortawesome/free-regular-svg-icons';
@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css'],
})
export class PostsComponent implements OnInit, OnChanges {
  @Input() post;

  faThumbsUp = faThumbsUp;
  faThumbsDown = faThumbsDown;
  faShareSquare = faShareSquare;
  faTrashAlt = faTrashAlt;

  uid = null;
  upvote = 0;
  downvote = 0;

  constructor(private auth: AuthService, private db: AngularFireDatabase) {
    this.auth.getUser().subscribe((user) => {
      this.uid = user?.uid;
      console.log("UId",this.uid);

    });
  }

  //for live changes on like and dislike icons
  ngOnChanges(): void {
    if (this.post.vote) {
      Object.values(this.post.vote).map((val: any) => {
        if (val.upvote) {
          this.upvote += 1;
        }
        if (val.downvote) {
          this.downvote += 1;
        }
      });
    }
  }

  ngOnInit(): void {}

  //to like a post
  upvotePost() {
    console.log('upvoting..');
    this.db.object(`/posts/${this.post.id}/vote/${this.uid}`).set({
      upvote: 1,
    });
  }

  //to unlike a post
  downvotePost() {
    console.log('Downvoting..');
    this.db.object(`/posts/${this.post.id}/vote/${this.uid}`).set({
      downvote: 1,
    });
  }

  getInstaUrl() {
    return `https://instagram.com/${this.post.instaId}`;
  }

  deletePost() {
    //alert('Delete');
      this.db.object(`/posts/${this.post.id}`).remove();
      // this.db.object(`/posts/${this.post.id}/vote/${this.uid}`).remove()
  }
}
