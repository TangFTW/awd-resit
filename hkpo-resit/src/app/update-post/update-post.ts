import { Component,Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {FormGroup, FormBuilder, Validators, ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PostRecord } from '../postrecord.model';

@Component({
  selector: 'app-update-post',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './update-post.html',
  styleUrl: './update-post.css',
})
export class UpdatePost {
  dialogRef: MatDialogRef<UpdatePost>;
  updatePostForm: FormGroup;
  http: HttpClient;
  serverData!: Object | null;
  serverDataArr!: any
  message: string = "Type an id to update a record.";

  constructor(dialogRef: MatDialogRef<UpdatePost>, fb: FormBuilder, http: HttpClient, @Inject(MAT_DIALOG_DATA) public data: PostRecord) {
    this.dialogRef = dialogRef;
    this.http = http;
    this.updatePostForm = fb.group({
      'id': [this.data.id, Validators.required],
      'mobileCode': [this.data.mobileCode],
      'dayOfWeekCode': [''],
      'seq': [this.data.seq],
      'districtEN': [this.data.districtEN],
      'nameEN': [this.data.nameEN],
      'addressEN': [''],
      'nameTC': [''],
      'openHour': [''],
      'closeHour': [''],

    });
  }

    updateRecord(formValue: any): void {
      this.serverData = null;
      let url = 'http://localhost:3001/mobilepost/' + formValue.id;

      console.log("Updating ID:...");
      console.log("URL:", url);
      // Empty field cleanup, prevent giving empty values to the db.
      Object.keys(formValue).forEach(key => {
        if (formValue[key] === '' || formValue[key] === null) {
          delete formValue[key];
        }
      });
      // field empty protection.
      if (Object.keys(formValue).length === 1) {
        this.message = "Please fill in at least one field to update.";
        return;
      }

      this.http.put(url, formValue).subscribe({
        next: (res) => {
          console.log(res);
          this.message = "Record " + formValue.id + " updated successfully!";
          this.dialogRef.close()
        },


        error: (err) => {
          // port crash handaler
          alert("Failed to update! Is the server running?");
          console.log(err);
        }
      });



    }
  closeModal(): void {
    this.dialogRef.close(); // cancel button — close without deleting
  }

}
