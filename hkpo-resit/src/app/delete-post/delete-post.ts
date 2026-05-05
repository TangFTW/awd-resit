import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { PostRecord } from '../postrecord.model';
import {CommonModule} from '@angular/common';



@Component({
  selector: 'app-delete-post',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './delete-post.html',
  styleUrl: './delete-post.css',
})
export class DeletePost {
  deletePostForm: FormGroup;
  http: HttpClient;
  serverData!: Object | null;
  serverDataArr!: any;

  constructor(fb: FormBuilder , http: HttpClient) {
    this.http = http;
    // Form Bulider
    this.deletePostForm = fb.group({
      'id': ['', Validators.required]
    });
  }

  deleteRecord(id: number): void {
    this.http.delete('http://localhost:3001/mobliepost/' + id).subscribe({
      next: (res) => {
        console.log("Data deleted:", res);
        this.serverDataArr = res;
      },
      error: (err) => {
        // port crash handaler
        alert("Failed to delete! Is the server running?");
        console.log(err);
      }
    });
  }



}
