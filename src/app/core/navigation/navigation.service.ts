import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject, tap, combineLatest, map } from 'rxjs';
import { Navigation } from 'app/core/navigation/navigation.types';
import { OverviewService } from 'app/modules/overview/overview.service';

@Injectable({
    providedIn: 'root'
})
export class NavigationService
{
    private _navigation: ReplaySubject<Navigation> = new ReplaySubject<Navigation>(1);

    private _navigationMenu$ = combineLatest([
        this._overviewService.getProductData(),
        this._overviewService.getOnepageData(),
        this._httpClient.get<Navigation>('api/common/navigation')]).pipe(
            map(([productData, onepageData, navigation]) => {
                const products = productData.map((v: any) => ({ 'id': `${v.id}`, 'link': `/station/stream/${v.id}`, 'title': `#${v.id} - ${v.username}`, 'type': 'basic' }));
                const oneProducts = onepageData.map((v: any) => ({ 'id': `${v.id}`, 'link': `/station/cms/${v.id}`, 'title': `#${v.id} - ${v.username}`, 'type': 'basic' }));

                // Filter navigation wehn onepage products no have
                const nav = (onepageData.length !== 0) ? navigation.default : navigation.default.filter(v => v.id !== 'websiteCMS');
                nav.map((v: any) => {
                    if (v.id === 'radioStreaming') {
                        v.children.push(...products);
                    } else if (v.id === 'websiteCMS') {
                        v.children.push(...oneProducts);
                    }
                    return v;
                });

                navigation.default = nav;
                return navigation;
            })
    );

    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private _overviewService: OverviewService)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for navigation
     */
    get navigation$(): Observable<Navigation>
    {
        return this._navigation.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get all navigation data
     */
    get(): Observable<Navigation>
    {
        return this._navigationMenu$.pipe(
            tap((navigation: Navigation) => {
                this._navigation.next(navigation);
            })
        );
    }
}
