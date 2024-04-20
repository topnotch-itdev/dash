import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { AnalyticsService } from 'app/modules/analytics/analytics.service';

@Injectable({
    providedIn: 'root'
})
export class AnalyticsResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _analyticsService: AnalyticsService)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>
    {
        const type = route.paramMap.get('type');
        const pid = Number(route.paramMap.get('pid'));
        const endpoint = (type === 'cms') ? 'control/onepage' : 'control/products';

        return forkJoin({
            analyzeData: this._analyticsService.getData(),
            productData: this._analyticsService.getProductByID(pid, endpoint)
        });
    }

    productData(): Observable<any> {
        return this._analyticsService.getProductData();
    }
}
