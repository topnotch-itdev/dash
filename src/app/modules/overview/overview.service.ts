import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, switchMap, of } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root'
})
export class OverviewService {
    private _data: BehaviorSubject<any> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for data
     */
    get data$(): Observable<any> {
        return this._data.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get data
     */
    getData(): Observable<any> {
        return this._httpClient.get('api/overview').pipe(
            tap((response: any) => {
                this._data.next(response);
            })
        );
    }

    getItem(key: string): string {
        return localStorage.getItem(key);
    }

    getUserData(): Observable<any>
    {
        return this._httpClient.get(environment.api + 'control/user-info').pipe(
            switchMap((response: any) => of(response))
        );
    }

    getProductData(): Observable<any>
    {
        return this._httpClient.get(environment.api + 'control/products').pipe(
            switchMap((response: any) => of(response))
        );
    }

    getOnepageData(): Observable<any>
    {
        return this._httpClient.get(environment.api + 'control/onepage').pipe(
            switchMap((response: any) => of(response))
        );
    }
}
