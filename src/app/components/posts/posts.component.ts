import { ToastrService } from 'ngx-toastr';
import { AngularFireDatabase } from '@angular/fire/database';
import { AuthService } from './../../services/auth.service';
import { Component, Input, OnChanges, OnInit } from '@angular/core';

import {
  faThumbsUp,
  faThumbsDown,
  faShareSquare,
  faTrashAlt,
  faComment,
} from '@fortawesome/free-regular-svg-icons';
import { NgForm } from '@angular/forms';
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
  faComment = faComment;

  uid = null;
  upvote = 0;
  downvote = 0;
  commentsSection: boolean = false;

  comments: any;
  userName: string;
  constructor(
    private auth: AuthService,
    private db: AngularFireDatabase,
    private toast: ToastrService
  ) {
    this.auth.getUser().subscribe((user) => {
      this.uid = user?.uid;
      this.userName = user?.email;
      console.log('UId', user);
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

  ngOnInit(): void {
    this.getComments();
  }

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
    this.toast.error('Post deleted successfully.');
    // this.db.object(`/posts/${this.post.id}/vote/${this.uid}`).remove()
  }

  //for enabling the comment section...
  enableCommentSection() {
    this.commentsSection = !this.commentsSection;
  }

  //for posting comments...
  postComments(f: NgForm) {
    const { comments } = f.value;
    this.db.object(`/posts/${this.post.id}/comments/${this.uid}`).set({
      comments: comments,
      email: this.userName
    });
    this.toast.success('Comment posted successfully.');
    this.enableCommentSection();
  }

  getComments() {
    this.db
      .list(`/posts/${this.post.id}/comments`)
      .valueChanges()
      .subscribe((res) => {
        console.log('comments', res);
        this.comments = res;
      });
  }

  // download(data){
  //   console.log("data",data);
  //   let link = document.createElement('a');
  //   link.download = data;
  //   link.href = data.url;
  //   link.click();
  // }

}
