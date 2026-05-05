import { Component, OnInit  } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
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

  constructor(fb: FormBuilder , http: HttpClient) {
    this.http = http;
    // Form Bulider
    this.searchPostForm = fb.group({
      'searchKey': ['', Validators.required]
    });
    this.deletePostForm = fb.group({
      'id': ['', Validators.required]
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
    this.http.get('http://localhost:3001/mobliepost').subscribe({
      next: (res) => {
        console.log("Data received:", res);
        this.serverDataArr = res;
      },
      error: (err) => {
        // port crash handaler
        console.log("Error fetching posts:", err);
      }
    });
  }

  // void aka do something, but return nothing
  ngOnInit(): void {
    this.getAllPosts();
  }

  }
