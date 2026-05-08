import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PostRecord } from '../postrecord.model';
import {FormGroup, FormBuilder, ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
// Dom Santizer: to allow google map use in the app(since Angular blocks exernal web connection)
import { DomSanitizer , SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-search-post',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './search-post.html',
  styleUrl: './search-post.css',
})


//
export class SearchPost implements OnInit {
  // propteries
  @Output() deletePostEvent = new EventEmitter<PostRecord>();
  @Output() editPostEvent: EventEmitter<PostRecord> = new EventEmitter<PostRecord>();
  searchPostForm: FormGroup;
  http: HttpClient;
  serverData!: Object | null;
  serverDataArr!: any;
  selectedPost!: PostRecord;
  message: string = 'Search record here.'
  mapAddress: string = ""; // address to show in Google Maps iframe
  mapUrl: SafeResourceUrl = "";


  constructor(fb: FormBuilder , http: HttpClient, private sanitizer: DomSanitizer) {
    this.http = http;
    // Form Bulider
    this.searchPostForm = fb.group({
      'id': [''],
      'districtEN': [''],
      'addressEN' : [''],
      'dayOfWeekCode': [''],
      'mobileCode': [''],
      'seq' : ['']
    });


  }
//methods
  deleteButtonHandler(post: PostRecord): void {
    console.log("Delete clicked for post ID:", post.id);
    this.deletePostEvent.emit(post);
    // Connect it when you making delete-post.
  }

  editButtonHandler(post: PostRecord): void {
    console.log("Edited record for post ID:", post.id);
    // when update, tell me.
    this.editPostEvent.emit(post);
  }
// gooogle map
    showMap(address: string): void {
      this.mapAddress = address;
      const url = "https://maps.google.com/maps?q=" + encodeURIComponent(address) + "&output=embed";
      this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);


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
        // improved error handling for test report
        if (err && err.status === 0) {
          this.message = "Cannot search. Is the server running?";
        } else if (err && err.status === 404) {
          this.message = "Record not found.";
        } else {
          this.message = "Error: " + (err?.message || err?.statusText || 'Unknown error');
        }
        console.log(err);
      }
    });
  }

  onSubmit(formValue: any): void {
    this.serverData = null;
    let url = '/mobilepost?';
    if (formValue.id) { url += 'id=' + formValue.id + '&'; }
    if (formValue.mobileCode) { url += 'mobileCode=' + formValue.mobileCode + '&'; }
    if (formValue.dayOfWeekCode) {url += 'dayOfWeekCode=' + formValue.dayOfWeekCode + '&';}
    if (formValue.districtEN) {url += 'districtEN=' + formValue.districtEN + '&';}
    if (formValue.seq) {url += 'seq=' + formValue.seq + '&';}

    console.log(url);
    this.http.get(url).subscribe({
      next: (res) => {
        console.log("Search results:", res);
        this.serverDataArr = (res as any).data;
      },
      error: (err) => {
        // improved error handling for test report
        if (err && err.status === 0) {
          this.message = "Cannot search. Is the server running?";
        } else if (err && err.status === 404) {
          this.message = "Record not found.";
        } else {
          this.message = "Error: " + (err?.message || err?.statusText || 'Unknown error');
        }
        console.log(err);
      }
    });
  }

  // void aka do something, but return nothing
  ngOnInit(): void {
    this.getAllPosts();
  }

}
