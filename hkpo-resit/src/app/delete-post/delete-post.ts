import { Component, Inject } from '@angular/core';
import {FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { PostRecord } from '../postrecord.model';
import {CommonModule} from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-delete-post',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './delete-post.html',
  styleUrl: './delete-post.css',

})
export class DeletePost {
  dialogRef: MatDialogRef<DeletePost>;
  deletePostForm: FormGroup;
  http: HttpClient;
  serverData!: Object | null;
  serverDataArr!: any
  message: string = "Click the submit button to delete";
//@inject: grab data was passed into this dialog when it was opened.

  constructor(dialogRef: MatDialogRef<DeletePost>, fb: FormBuilder, http: HttpClient, @Inject(MAT_DIALOG_DATA) public data: PostRecord)  {
    this.http = http;
    this.dialogRef = dialogRef;
    // Form Bulider
    this.deletePostForm = fb.group({
      'id': ['', Validators.required]
    });
  }

  deleteRecord(id: number): void {
    this.serverData = null;
    let url = 'http://localhost:3001/mobilepost/' + id;

    console.log("Deleting ID:", id);
    console.log("URL:", url);

    this.http.delete(url).subscribe({
      next: (res) => {
        console.log(res);
        this.message = "Record " + id + " deleted successfully";
        this.serverDataArr = JSON.parse(JSON.stringify(res));
        this.dialogRef.close();
      },
      error: (err) => {
        // port crash handaler
        alert("Failed to delete! Is the server running?");
        console.log(err);
      }
    });
  }

  confirmDelete(): void {
    this.deleteRecord(this.data.id); // triggers delete
  }
  closeModal(): void {
    this.dialogRef.close(); // cancel button — close without deleting
  }
}

