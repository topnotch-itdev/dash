import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { OverviewService } from 'app/modules/overview/overview.service';

@Injectable({
    providedIn: 'root'
})
export class OverviewResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _overviewService: OverviewService) {
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        const obsArg = {
            userData: this._overviewService.getUserData(),
            productData: this._overviewService.getProductData(),
            onepageData: this._overviewService.getOnepageData(),
        };
        return forkJoin(obsArg);
    }

}
