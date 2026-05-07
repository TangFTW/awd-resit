import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { PostRecord } from '../postrecord.model';
import {CommonModule} from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';

// handles post(create record) request
@Component({
  selector: 'app-create-post',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-post.html',
  styleUrl: './create-post.css',
})
export class CreatePost {
  dialogRef: MatDialogRef<CreatePost>;
  createPostForm: FormGroup;
  http: HttpClient;
  serverData!: Object | null;
  serverDataArr!: any;
  message: string = 'Create record here.'
//build a form.
  constructor(dialogRef: MatDialogRef<CreatePost>, fb: FormBuilder, http: HttpClient)  {
    this.http = http;
    this.dialogRef = dialogRef;
// enter essenial data for creating a data
    this.createPostForm = fb.group({
      'mobileCode': ['', Validators.required],
      'dayOfWeekCode': ['', Validators.required],
      'seq': ['', Validators.required],
      'districtEN': ['', Validators.required],
      'nameEN': [''],
      'addressEN': [''],
      'nameTC': [''],
      'openHour': [''],
      'closeHour': [''],

    });

  }
  // void aka do something, but return nothing
  createRecord(formValue: any): void {
    this.serverData = null;
    let url = 'http://localhost:3001/mobilepost';

    console.log("Creating new post...");
    console.log("URL:", url);

    this.http.post(url, formValue).subscribe({
      next: (res) => {
        console.log(res);
        this.message = "Record " + (res as any).data.id + " created successfully!";
        this.dialogRef.close();
      },


      error: (err) => {
        // port crash handaler
        alert("Failed to create! Is the server running?");
        console.log(err);
      }
    });

  }

  closeModal(): void {
    this.dialogRef.close();
  }
}

