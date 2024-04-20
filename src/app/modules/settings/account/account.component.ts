import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector       : 'settings-account',
    templateUrl    : './account.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsAccountComponent implements OnInit
{
    accountForm: FormGroup;

    /**
     * Constructor
     */
    constructor(
        private _formBuilder: FormBuilder
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Create the form
        this.accountForm = this._formBuilder.group({
            firstName    : ['Brian'],
            lastName    : ['Hughes'],
            companyName: ['YXZ Software'],
            email: ['admin@unmuted.ltd'],
            payment: ['default'],
            billing: ['default'],
            hearAboutUs: ['google'],
            address1: ['Demo Street'],
            address2: ['Demo Area'],
            city: ['Demo City'],
            state: ['Demo State'],
            zipCode: ['000000'],
            country: ['UK'],
            phone   : ['121-490-33-12'],
            vatNumber: [''],
            generalEmail: [ true ],
            invoiceEmail: [ true ],
            supportEmail: [ true ],
            productEmail: [ true ],
            domainEmail: [ true ],
            affiliateEmail: [ true ],
            mailingList: [ true ]
        });
    }

    cancelBtn(){
        this.accountForm.get('mailingList').setValue(false);
    }
}
