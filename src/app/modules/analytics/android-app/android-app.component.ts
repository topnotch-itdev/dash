import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';

@Component({
  selector: 'app-android-app',
  templateUrl: './android-app.component.html',
  styleUrls: ['./android-app.component.scss']
})
export class AndroidAppComponent implements OnInit {
  androidPageForm: FormGroup;
  CustomFile;
  public isMobile: boolean = false;
  constructor( private _formBuilder: FormBuilder,private breakpointObserver: BreakpointObserver) { }

  ngOnInit(): void {
    this.breakpointObserver.observe([
      '(max-width: 599px)'
    ]).subscribe((result) => {
      this.isMobile = result.matches;
    });
    this.androidPageForm = this._formBuilder.group({
        name    : [''],
        uploadIcon : [''],
    });
  }

  onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.CustomFile = file;
    }
  }

}
