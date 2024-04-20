import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';

@Component({
  selector: 'app-alexa-skill',
  templateUrl: './alexa-skill.component.html',
  styleUrls: ['./alexa-skill.component.scss']
})
export class AlexaSkillComponent implements OnInit {
  alexaSkillForm: FormGroup;
  CustomFile;
  public isMobile: boolean = false;
  constructor(private _formBuilder: FormBuilder,private breakpointObserver: BreakpointObserver) { }

  ngOnInit(): void {
    this.alexaSkillForm = this._formBuilder.group({
      skillName : [''],
      invocationName    : [''],
      uploadImage : [''],
    });
    this.breakpointObserver.observe([
      '(max-width: 599px)'
    ]).subscribe((result) => {
      this.isMobile = result.matches;
    });
  }

  onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.CustomFile = file;
    }
  }
}
