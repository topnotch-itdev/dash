import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import { FormControl, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { Color } from '@angular-material-components/color-picker';
import { AnalyticsService } from '../analytics.service';

@Component({
  selector: 'app-ios-app',
  templateUrl: './ios-app.component.html',
  styleUrls: ['./ios-app.component.scss']
})
export class IosAppComponent implements OnInit, OnChanges {
  @Input() identify: string;
  iosForm: FormGroup;
  iosFormControl: FormArray;
  submitted = false;
  index = 0;
  backgroundType: string = 'image';
  warningMsg: string = null;
  alertStatus = { alert: false, warning: false };
  notifyMsg: string = null;

  public disabled = false;
  public color: ThemePalette = 'primary';
  public touchUi = false;
  colorCtr: any = new FormControl({value: new Color(236, 0, 255), disabled: false}, [Validators.required]);

  accentColorCtr: any = new FormControl({value: new Color(236, 0, 255), disabled: false}, [Validators.required]);
  public accentColour: ThemePalette = 'primary';

  public isMobile: boolean = false;
  public selectForm: number = 0;

  private _userName: string;
  private _iosAppData: any;

  constructor(private fb: FormBuilder, private breakpointObserver: BreakpointObserver, private analyticsService: AnalyticsService) { }

  ngOnInit(): void {
    this.breakpointObserver.observe([
      '(max-width: 599px)'
    ]).subscribe((result) => {
      this.isMobile = result.matches;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Set form values when user changes services
    if (changes.identify.currentValue) {
      this._userName = changes.identify.currentValue;
      this.setForm();
    }
  }

  setForm(): void {
    this.analyticsService
      .getPlayingData(`control/service-ios-app/settings/${this._userName}`)
      .subscribe({
        next: (res: any) => {
          this._iosAppData = res;
          const buttons = this._iosAppData.buttons.map((v: any) => ({ groupBtns: v.name, groupBtnText: v.url }));
          this.index = this._iosAppData.buttons.length;

          // Creating form
          this.createForm();

          // Set colour to colour picker
          const accentColour = this.hexToRgb(this._iosAppData.accentColour);
          const backgroundColour = this.hexToRgb(this._iosAppData.backgroundColour);
          this.accentColorCtr.setValue(accentColour);
          this.colorCtr.setValue(backgroundColour);

          this.backgroundType = this._iosAppData.backgroundType;
          this.iosForm.setValue({
            appName: this._iosAppData.appName,
            appDescription: this._iosAppData.appDescription,
            background: this.backgroundType,
            logoFile: '',
            appIcon: '',
            backgroundImage: '',
            radioLink: this._iosAppData?.radioLink ? this._iosAppData?.radioLink : '',
            shareText: this._iosAppData?.shareText ? this._iosAppData?.shareText : '',
            albumArt: '',
            iosFormControl: buttons,
            appleID: this._iosAppData.appleID,
            applePassword: this._iosAppData.applePassword
          });
        },
        error: (err) => {
          console.log(err);

          // Creating form
          this.createForm();
        }
      });
  }

  createForm(): void {
    this.iosForm = this.fb.group({
      appName: ['', Validators.required],
      appDescription: [''],
      logoFile: [''],
      appIcon: [''],
      background: [''],
      backgroundImage: [''],
      radioLink: [''],
      shareText: [''],
      albumArt: [''],
      iosFormControl: this.index === 0 ? this.fb.array([]) : this.fb.array([...this._iosAppData.buttons.map((v: any) => this.createItem())]),
      appleID: ['', Validators.required],
      applePassword: ['', Validators.required],
    });
  }

  saveIOSData(): void {
    this.submitted = true;
    if (this.iosForm.invalid || !this._iosAppData?.appLogo || !this._iosAppData?.appIcon) {
      this.warningMsg = 'Please fill in form required fields.';
      this.alertStatus.warning = true;
      setTimeout(() => {
          this.alertStatus.warning = false;
      }, 10000);
      return;
    }
    const buttons = this.iosForm.value.iosFormControl
      .map((v: any) => ({ 'name': v.groupBtns, 'url': v.groupBtnText }));

    if (this.backgroundType === 'colour') {
      this._iosAppData = { ...this._iosAppData, backgroundColour: `#${this.colorCtr.value.hex}` };
    }

    this._iosAppData = {
      ...this._iosAppData,
      appName: this.iosForm.value.appName,
      appDescription: this.iosForm.value.appDescription,
      backgroundType: this.backgroundType,
      accentColour: `#${this.accentColorCtr.value.hex}`,
      radioLink: this.iosForm.value.radioLink,
      shareText: this.iosForm.value.shareText,
      buttons: buttons,
      appleID: this.iosForm.value.appleID,
      applePassword: this.iosForm.value.applePassword
    };

    this.analyticsService
      .putPlayingData(`control/service-ios-app/settings/${this._userName}`, this._iosAppData)
      .subscribe({
        next: (res) => {
          this.notifyMsg = 'Changes saved';
          this.alertStatus.alert = true;
          this.alertStatus.warning = false;
          setTimeout(() => {
            this.alertStatus.alert = false;
          }, 10000);
        },
        error: (err) => {
          this.warningMsg = err.error.error;
          this.alertStatus.warning = true;
        }
      });
  }

  removeIOSData(): void {
    this.iosForm.reset();
    this.iosForm.clearValidators();

    // Deleting player settings
    this.analyticsService.removePlayingData(`control/service-ios-app/settings/${this._userName}`).subscribe((res) => {
      this.notifyMsg = 'Settings removed';
      this.alertStatus.alert = true;
      setTimeout(() => {
          this.alertStatus.alert = false;
      }, 10000);
    });
  }

  handleSelectForm(status: string): void {
    if (status === 'next') {
      this.selectForm += 1;
    } else if (this.selectForm > 0) {
      this.selectForm -= 1;
    }
  }

  createItem(): any {
    return this.fb.group({
      groupBtns: ['facebook'],
      groupBtnText: ['']
    });
  }

  deleteDynamicBox(index): void {
    (<FormArray>this.iosForm.get("iosFormControl")).removeAt(index);
    this.index = this.iosFormControl?.length ? this.iosFormControl?.length : 0;
  }

  addDynamicBox(): void {
    this.iosFormControl = this.iosForm.get('iosFormControl') as FormArray;
    this.iosFormControl.push(this.createItem());
    this.index = this.iosFormControl.length;
  }

  uploadFile(event: Event, type: string): void {
    const file = (event.target as HTMLInputElement).files[0];
    const uploadImage = new FormData();
    uploadImage.append('image', file);

    this.analyticsService
      .uploadFile(`control/service-ios-app/upload-iosapp/${this._userName}`, uploadImage)
      .subscribe({
        next: (res) => {
          if (type === 'logo') {
            this._iosAppData = {
              ...this._iosAppData,
              appLogo: res.link
            };
          } else if (type === 'icon') {
            this._iosAppData = {
              ...this._iosAppData,
              appIcon: res.link
            };
          } else if (type === 'background') {
            this._iosAppData = {
              ...this._iosAppData,
              backgroundImage: res.link
            };
          } else if (type === 'album') {
            this._iosAppData = {
              ...this._iosAppData,
              defaultAlbumArt: res.link
            };
          }
         },
        error: (err) => {
          this.warningMsg = err.error.error;
          this.alertStatus.warning = true;
        }
      });
  }

  get f() {
    return this.iosForm.controls;
  }

  hexToRgb(hex: string): Color {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? new Color(parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)) : null;
  }
}
