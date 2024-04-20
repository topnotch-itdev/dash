import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AnalyticsService } from '../analytics.service';

@Component({
  selector: 'app-tune-integration',
  templateUrl: './tune-integration.component.html',
  styleUrls: ['./tune-integration.component.scss']
})
export class TuneIntegrationComponent implements OnInit, OnChanges {
  @Input() identify: string;
  tuneInAIRIntegrationForm: FormGroup;
  submitted = false;
  enableBtn = false;
  tuneInData: any;
  warningMsg: string = null;
  alertStatus = { alert: false, warning: false };
  notifyMsg: string = null;
  private _userName: string;

  constructor(private fb: FormBuilder, private analyticsService: AnalyticsService) { }

  ngOnInit(): void {
    this.createForm();
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
      .getPlayingData(`control/tunein-air-integration/settings/${this._userName}`)
      .subscribe({
        next: (res: any) => {
          this.tuneInData = res;
          this.tuneInAIRIntegrationForm.setValue({
            stationId: this.tuneInData.stationId,
            partnerId: this.tuneInData.partnerId,
            partnerKey: this.tuneInData.partnerKey,
            isEnabled: this.tuneInData.isEnabled,
          });

          if (!this.tuneInData.isEnabled) {
            this.alertStatus.warning = true;
          }
        },
        error: (err) => {
          this.tuneInAIRIntegrationForm.reset();
        }
      });
  }

  createForm(): void {
    this.tuneInAIRIntegrationForm = this.fb.group({
      isEnabled: '',
      stationId: ['', Validators.required],
      partnerId: ['', Validators.required],
      partnerKey: ['', Validators.required],
    });
  }
  savePlayingData(): void {
    this.submitted = true;
    if (this.tuneInAIRIntegrationForm.invalid) {
      return;
    }
    const data = {
      stationId: this.tuneInAIRIntegrationForm.value.stationId,
      partnerId: this.tuneInAIRIntegrationForm.value.partnerId,
      partnerKey: this.tuneInAIRIntegrationForm.value.partnerKey,
      isEnabled: this.tuneInAIRIntegrationForm.value.isEnabled,
    };

    this.analyticsService
      .putPlayingData(`control/tunein-air-integration/settings/${this._userName}`, data)
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
  removePlayingData(): void {
    this.tuneInAIRIntegrationForm.reset();
    this.tuneInAIRIntegrationForm.clearValidators();

    // Deleting tune settings
    this.analyticsService.removePlayingData(`control/tunein-air-integration/settings/${this._userName}`).subscribe((res) => {
      this.notifyMsg = 'Settings removed';
      this.alertStatus.alert = true;
      this.alertStatus.warning = true;
      setTimeout(() => {
          this.alertStatus.alert = false;
      }, 10000);
    });
  }

  get f() {
    return this.tuneInAIRIntegrationForm.controls;
  }
}
