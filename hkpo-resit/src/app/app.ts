import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SearchPost } from './search-post/search-post';
import { DeletePost } from './delete-post/delete-post';
import { UpdatePost } from './update-post/update-post';
import { CreatePost } from './create-post/create-post';
import { TitleCasePipe } from '@angular/common';
import {MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SearchPost, DeletePost, UpdatePost, CreatePost, TitleCasePipe] ,
  templateUrl: './app.html',
  styleUrl: './app.css',

})
export class App {
  title = 'HKPO Mobile Post Office';

  dialogConfig = new MatDialogConfig();
  createPostDialogRef: MatDialogRef<CreatePost, any> | undefined;
  deletePostDialogRef: MatDialogRef<DeletePost, any> | undefined;


  constructor(private dialog: MatDialog) {
  }
  openDeleteDialog(post: PostRecord): void {
    console.log("App: deleteEvent received");
    this.dialogConfig.data = post;
    this.dialogConfig.id = "deletePost";
    this.dialogConfig.height = "500px";
    this.dialogConfig.width = "650px";
    this.deletePostDialogRef = this.dialog.open(DeletePost, this.dialogConfig);
  }
  openCreateDialog(): void {
      console.log("App: createEvent received");
      this.dialogConfig.id = "createPost";
      this.dialogConfig.height = "500px";
      this.dialogConfig.width = "650px";
      // when success, return new data and update to db.
      this.createPostDialogRef = this.dialog.open(CreatePost, this.dialogConfig);
    }


}
