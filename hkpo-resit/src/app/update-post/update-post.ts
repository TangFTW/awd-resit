import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {FormGroup, FormBuilder, Validators, ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-update-post',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './update-post.html',
  styleUrl: './update-post.css',
})
export class UpdatePost {
  updatePostForm: FormGroup;
  http: HttpClient;
  serverData!: Object | null;
  serverDataArr!: any
  message: string = "Type an id to update a record.";

  constructor(fb: FormBuilder, http: HttpClient) {
    this.http = http;
    this.updatePostForm = fb.group({
      'id': ['', Validators.required],
      'mobileCode': [''],
      'dayOfWeekCode': [''],
      'seq': [''],
      'districtEN': [''],
      'nameEN': [''],
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

      this.http.put(url, formValue).subscribe({
        next: (res) => {
          console.log(res);
          this.message = "Record " + formValue.id + " updated successfully!";
        },


        error: (err) => {
          // port crash handaler
          alert("Failed to update! Is the server running?");
          console.log(err);
        }
      });



    }


}
