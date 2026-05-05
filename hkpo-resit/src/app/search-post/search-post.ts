import { Component, OnInit  } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PostRecord } from '../postrecord.model';
import {FormGroup, FormBuilder, Validators, ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-post',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './search-post.html',
  styleUrl: './search-post.css',
})


//
export class SearchPost implements OnInit {

  searchPostForm: FormGroup;
  http: HttpClient;
  serverData!: Object | null;
  serverDataArr!: any;
  selectedPost!: PostRecord;
  message: string = 'Search record here.'

  constructor(fb: FormBuilder , http: HttpClient) {
    this.http = http;
    // Form Bulider
    this.searchPostForm = fb.group({
      'id': [''],
      'districtEN': [''],
      'dayOfWeekCode': [''],
      'mobileCode': ['']
    });


  }

  deleteButtonHandler(post: PostRecord): void {
    console.log("Delete clicked for post ID:", post.id);
    // Connect it when you making delete-post.
  }

  editButtonHandler(post: PostRecord): void {
    console.log("Edited record for post ID:", post.id);
    // Connect it when you making update-post.
  }

  getAllPosts(): void {
    this.serverData = null;
    let url = 'http://localhost:3001/mobilepost';
    console.log(url);
    this.http.get(url).subscribe({
      next: (res) => {
        console.log("Data received:", res);
        this.serverDataArr = (res as any).data;
      },
      error: (err) => {
        // port crash handle
        console.log("Error fetching posts:", err);
      }
    });
  }

  onSubmit(formValue: any): void {
    this.serverData = null;
    let url = 'http://localhost:3001/mobilepost?';
    if (formValue.id) { url += 'id=' + formValue.id + '&'; }
    if (formValue.mobileCode) { url += 'mobileCode=' + formValue.mobileCode + '&'; }
    if (formValue.dayOfWeekCode) {url += 'dayOfWeekCode=' + formValue.dayOfWeekCode + '&';}
    if (formValue.districtEN) {url += 'districtEN=' + formValue.districtEN + '&';}
    console.log(url);
    this.http.get(url).subscribe({
      next: (res) => {
        console.log("Search results:", res);
        this.serverDataArr = (res as any).data;
      },
      error: (err) => {
        console.log("Error searching posts:", err);
      }
    });
  }

  // void aka do something, but return nothing
  ngOnInit(): void {
    this.getAllPosts();
  }

}
