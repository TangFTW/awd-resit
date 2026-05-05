import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { PostRecord } from '../postrecord.model';
import {CommonModule} from '@angular/common';
// handles post(create record) request
@Component({
  selector: 'app-create-post',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-post.html',
  styleUrl: './create-post.css',
})
export class CreatePost {
  createPostForm: FormGroup;
  http: HttpClient;
  serverData!: Object | null;
  serverDataArr!: any;

  constructor(fb: FormBuilder, http: HttpClient) {
    this.http = http;
// enter essenial data for creating a data
    this.createPostForm = fb.group({
      'mobileCode': ['', Validators.required],
      'dayOfWeekCode': ['', Validators.required],
      'seq': ['', Validators.required],
      'districtEN': ['', Validators.required],
      'nameEN': ['', Validators.required],
      'openHour': ['', Validators.required],
      'closeHour': ['', Validators.required],
    });

  }

  createRecord(formValue: any): void {

  }
}
