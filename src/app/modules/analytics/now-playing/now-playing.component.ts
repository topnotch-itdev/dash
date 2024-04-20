import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AnalyticsService } from '../analytics.service';
@Component({
    selector: 'app-now-playing',
    templateUrl: './now-playing.component.html',
    styleUrls: ['./now-playing.component.scss']
})
export class NowPlayingComponent implements OnInit, OnChanges {
    @Input() identify: string;
    playingDataForm: FormGroup;
    submitted = false;
    enableBtn = false;
    playingData: any;
    alertStatus = { alert: false, warning: false };
    notifyMsg: string = null;
    warningMsg: string = null;
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
            .getPlayingData(`control/now-playing-tweets/settings/${this._userName}`)
            .subscribe({
                next: (res: any) => {
                    this.playingData = res;
                    this.playingDataForm.setValue({
                        tweet: this.playingData.tweet,
                        options: this.playingData.mode,
                        interval: this.playingData.interval,
                        apiKey: this.playingData.apiKey,
                        apiSecret: this.playingData.apiSecret,
                        accessToken: this.playingData.accessToken,
                        accessTokenSecret: this.playingData.accessTokenSecret,
                        isEnabled: this.playingData.isEnabled,
                    });

                    if (!this.playingData.isEnabled) {
                        this.alertStatus.warning = true;
                    }
                },
                error: (err) => {
                    this.playingDataForm.reset();
                }
            });
    }

    createForm(): void {
        this.playingDataForm = this.fb.group({
            tweet: [''],
            options: [''],
            interval: [''],
            apiKey: ['', Validators.required],
            apiSecret: ['', Validators.required],
            accessToken: ['', Validators.required],
            accessTokenSecret: ['', Validators.required],
            isEnabled: ''
        });
    }

    savePlayingData(): void {
        this.submitted = true;
        if (this.playingDataForm.invalid) {
            return;
        }
        const data = {
            'tweet': this.playingDataForm.value.tweet,
            'mode': this.playingDataForm.value.options,
            'interval': this.playingDataForm.value.interval,
            'apiKey': this.playingDataForm.value.apiKey,
            'apiSecret': this.playingDataForm.value.apiSecret,
            'accessToken': this.playingDataForm.value.accessToken,
            'accessTokenSecret': this.playingDataForm.value.accessTokenSecret,
            'isEnabled': this.playingDataForm.value.isEnabled,
        };
        this.analyticsService
            .putPlayingData(`control/now-playing-tweets/settings/${this._userName}`, data)
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
        this.playingDataForm.reset();
        this.playingDataForm.clearValidators();

        // Deleting playing settings
        this.analyticsService.removePlayingData(`control/now-playing-tweets/settings/${this._userName}`).subscribe((res) => {
            this.notifyMsg = 'Settings removed';
            this.alertStatus.alert = true;
            this.alertStatus.warning = true;
            setTimeout(() => {
                this.alertStatus.alert = false;
            }, 10000);
        });
    }

    get f() {
        return this.playingDataForm.controls;
    }


}
