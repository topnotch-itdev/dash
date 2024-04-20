import { Component, OnInit, OnChanges, SimpleChanges, Input, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { AnalyticsService } from '../analytics.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit, OnChanges {
  @Input() identify: string;
  @ViewChild('logoFileInput') private _logoFileInput: ElementRef;
  @ViewChild('nocoverFileInput') private _nocoverFileInput: ElementRef;
  playerMusicForm: FormGroup;
  submitted = false;
  enableBtn = false;
  index = 0;
  playingFormControl: FormArray;
  playerData: any;
  warningMsg: string = null;
  alertStatus = { alert: false, warning: false };
  notifyMsg: string = null;
  thumbnails = { logo: '', nocover: '' };
  previewWidth = 300;
  previewHeight = 150;
  playerUrl: string;
  previewUrl: SafeResourceUrl;

  private _userName: string;
  private _savingPlayer: any;

  constructor(private fb: FormBuilder, private analyticsService: AnalyticsService, public sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.createForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Set form values when user changes services
    if (changes.identify.currentValue) {
      this._userName = changes.identify.currentValue;
      this.setForm();
      this.playerUrl = `https://player.shoutca.st/?username=${this._userName}`;
      this.previewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.playerUrl);
    }
  }

  setForm(): void {
    this.analyticsService
      .getPlayingData(`control/player/settings/${this._userName}`)
      .subscribe({
        next: (res: any) => {
          this.playerData = res;
          this.index = this.playerData.buttons.length;
          // Make button array to avoid form initial value error
          const buttons = this.index > 0 ?
            this.playerData.buttons.map((v: any) => ({ groupBtns: v.name, groupBtnText: v.url }))
            : [{ groupBtns: 'website', groupBtnText: '' }];

          // Reset form buttons elements
          this.createForm();

          this.playerMusicForm.setValue({
            stationName: this.playerData.name,
            logoFile: '',
            artworkFile: '',
            backgroundColor: this.playerData.backgroundColour,
            tint: this.playerData.tint,
            playingFormControl: buttons
          });

          // Set logo and nocover images
          this.thumbnails.logo = this.playerData.logo;
          this.thumbnails.nocover = this.playerData.nocover;
        },
        error: (err) => {
          this.playerMusicForm.reset();
          this.playerMusicForm.patchValue({ groupBtns: 'website' });
        }
      });
  }

  createForm(): void {
    const buttonItems = [];
    if (this.index > 0) {
      for (let i = 0; i < this.index; i++) {
        buttonItems.push(this.createItem());
      }
    } else {
      buttonItems.push(this.createItem());
    }

    this.playerMusicForm = this.fb.group({
      stationName: ['', Validators.required],
      logoFile: [''],
      artworkFile: [''],
      backgroundColor: [''],
      tint: [''],
      playingFormControl: this.fb.array(buttonItems)
    });
  }
  savePlayingData(): void {
    this.submitted = true;
    if (this.playerMusicForm.invalid) {
      return;
    }
    const buttons = this.playerMusicForm.value.playingFormControl
      .map((v: any) => ({ 'name': v.groupBtns ? v.groupBtns : 'website', 'icon': v.groupBtns ? v.groupBtns : 'website', 'url': v.groupBtnText }));

    this._savingPlayer = {
      ...this._savingPlayer,
      name: this.playerMusicForm.value.stationName,
      backgroundColour: this.playerMusicForm.value.backgroundColor,
      tint: this.playerMusicForm.value.tint,
      buttons: buttons
    };
    if (this.thumbnails.logo !== '' && !Object.keys(this._savingPlayer).includes('logo')) {
      this._savingPlayer = {
        ...this._savingPlayer,
        logo: this.playerData.logo
      };
    }
    if (this.thumbnails.nocover !== '' && !Object.keys(this._savingPlayer).includes('nocover')) {
      this._savingPlayer = {
        ...this._savingPlayer,
        nocover: this.playerData.nocover
      };
    }

    this.analyticsService
      .putPlayingData(`control/player/settings/${this._userName}`, this._savingPlayer)
      .subscribe({
        next: (res) => {
          this.notifyMsg = 'Changes saved';
          this.alertStatus.alert = true;
          this.alertStatus.warning = false;
          setTimeout(() => {
            this.alertStatus.alert = false;
          }, 10000);

          this.refreshPreview();
        },
        error: (err) => {
          this.warningMsg = err.error?.error ?? 'Something went wrong...';
          this.alertStatus.warning = true;
        }
      });
  }
  removePlayingData(): void {
    this.playerMusicForm.reset();
    this.playerMusicForm.clearValidators();

    // Deleting player settings
    this.analyticsService.removePlayingData(`control/player/settings/${this._userName}`).subscribe((res) => {
      this.notifyMsg = 'Settings removed';
      this.alertStatus.alert = true;
      this.alertStatus.warning = true;
      setTimeout(() => {
        this.alertStatus.alert = false;
      }, 10000);
    });
  }

  get f() {
    return this.playerMusicForm.controls;
  }

  createItem() {
    return this.fb.group({
      groupBtns: ['website'],
      groupBtnText: ['']
    });
  }
  deleteDynamicBox(index): void {
    this.playingFormControl = this.playerMusicForm.get('playingFormControl') as FormArray;
    this.playingFormControl.removeAt(index);
    this.index = this.playingFormControl ? this.playingFormControl.length : 0;
  }
  addDynamicBox(): void {
    this.playingFormControl = this.playerMusicForm.get('playingFormControl') as FormArray;
    if (this.index === 0 && this.playingFormControl.controls.length > 0) {
      this.playingFormControl.controls.pop();
    }
    this.playingFormControl.push(this.createItem());
    this.index = this.playingFormControl.length;
  }

  uploadFile(fileList: FileList, kind: string): void {
    const file = fileList[0];
    const allowedTypes = ['image/jpeg', 'image/png'];
    // Return if the file is not allowed
    if (!allowedTypes.includes(file?.type)) { return; }
    const uploadImage = new FormData();
    uploadImage.append('image', file);

    this.analyticsService
      .uploadFile(`control/player/upload-image/${this._userName}`, uploadImage)
      .subscribe({
        next: (res) => {
          if (kind === 'logo') {
            this._savingPlayer = { ...this._savingPlayer, logo: res.link };
            this.thumbnails.logo = res.link;
          } else {
            this._savingPlayer = { ...this._savingPlayer, nocover: res.link };
            this.thumbnails.nocover = res.link;
          }
        },
        error: (err) => {
          this.warningMsg = err.error?.error ?? 'Something went wrong...';
          this.alertStatus.warning = true;
        }
      });
  }


  /**
   * Remove the logo and nocover image
   */
  removeImage(kind: string): void {
    if (kind === 'logo') {
      // Get the form control for 'avatar'
      const logoFormControl = this.playerMusicForm.get('logoFile');
      logoFormControl.setValue(null);

      // Set the file input value as null
      this._logoFileInput.nativeElement.value = null;
      // Update the thumbnails
      this.thumbnails.logo = null;
      // Set logo empty
      this._savingPlayer = { ...this._savingPlayer, logo: '' };
    } else {
      // Get the form control for 'avatar'
      const nocoverFormControl = this.playerMusicForm.get('artworkFile');
      nocoverFormControl.setValue(null);

      // Set the file input value as null
      this._nocoverFileInput.nativeElement.value = null;
      // Update the thumbnails
      this.thumbnails.nocover = null;
      // Set nocover empty
      this._savingPlayer = { ...this._savingPlayer, nocover: '' };
    }
  }

  // Set preview size
  setPreviewSize(width = 300, height = 150): void {
    if (width) {
      this.previewWidth = width;
    }
    if (height) {
      this.previewHeight = height;
    }
  }

  // Refresh preview url
  refreshPreview(): void {
    this.previewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`${this.playerUrl}&t=${new Date().getTime()}`);
  }
}
