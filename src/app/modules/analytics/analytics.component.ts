import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ApexOptions } from 'ng-apexcharts';
import { MatDrawer } from '@angular/material/sidenav';
import { AnalyticsService } from 'app/modules/analytics/analytics.service';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'analytics',
    templateUrl: './analytics.component.html',
    // encapsulation: ViewEncapsulation.None,
    // changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnalyticsComponent implements OnInit, OnDestroy {
    @ViewChild('drawer') drawer: MatDrawer;
    panels: any[] = [];
    selectedPanel: string = 'information';
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = true;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    productData: any;
    public loading = false;

    /**
     * Constructor
     */

    constructor(
        private _analyticsService: AnalyticsService,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _changeDetectorRef: ChangeDetectorRef,
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.getProductData();
        this.panels = [
            {
                id: 'information',
                icon: 'info',
                title: 'INFORMATION'
            },
            {
                id: 'nowPlaying',
                icon: 'heroicons_outline:lock-closed',
                title: 'Now Playing'
            },
            {
                id: 'tuneInAIRIntegration',
                icon: 'headphones',
                title: 'TuneIn AIR Integration'
            },
            {
                id: 'player',
                icon: 'play_arrow',
                title: 'Player'
            },
            // {
            //     id: 'iosApp',
            //     icon: 'phone_iphone',
            //     title: 'iOS App'
            // },
            // {
            //     id: 'androidApp',
            //     icon: 'android',
            //     title: 'Android App'
            // },
            // {
            //     id: 'alexaSkill',
            //     icon: 'mic',
            //     title: 'Alexa Skill'
            // },
        ];

        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ matchingAliases }) => {

                // Set the drawerMode and drawerOpened
                if (matchingAliases.includes('lg')) {
                    this.drawerMode = 'side';
                    this.drawerOpened = true;
                }
                else {
                    this.drawerMode = 'over';
                    this.drawerOpened = false;
                }

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    getProductData(): void {
        this.loading = true;
        this._activatedRoute.data.subscribe((result) => {
            if (result) {
                this.productData = result.data.productData;
            }
        });
        this.loading = false;
    }
    goToPanel(panel: string): void {
        this.selectedPanel = panel;

        // Close the drawer on 'over' mode
        if (this.drawerMode === 'over') {
            this.drawer.close();
        }
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    getPanelInfo(id: string): any {
        return this.panels.find(panel => panel.id === id);
    }

    putPlayingData(){
        
    }


}
