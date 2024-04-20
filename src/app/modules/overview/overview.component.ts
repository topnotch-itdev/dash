import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ApexOptions } from 'ng-apexcharts';
import { OverviewService } from 'app/modules/overview/overview.service';

@Component({
    selector: 'overview',
    templateUrl: './overview.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OverviewComponent implements OnInit, OnDestroy {
    data: any;
    userData: any;
    productData: any;
    onepageData: any;
    overviewType: string = 'radio';
    onepageEnabled: boolean = false;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _overviewService: OverviewService,
        private _router: Router,
        private _activatedRoute: ActivatedRoute
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Get the data
        this.getData();
    }

    getData(): void {
        this._activatedRoute.data.subscribe((data) => {
            this.userData = data.userData.userData;
            this.productData = data.userData.productData?.filter((v: any) => v.status === 'Active');
            this.onepageData = data.userData.onepageData?.filter((v: any) => v.status === 'Active');
            if (this.onepageData.length > 0) {
                this.onepageEnabled = true;
            } else {
                this.onepageEnabled = false;
            }
        });
    }
    viewMoreData(pid: any): void {
        const type = this.overviewType === 'radio' ? 'stream' : 'cms';
        this._router.navigateByUrl(`station/${type}/${pid}`);
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    /**
     * Update overview status type
     *
     * @param overview
     */
    typeOverview(overview: string): void {
        this.overviewType = overview;
    }
}
