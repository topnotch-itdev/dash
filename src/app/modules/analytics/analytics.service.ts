import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, switchMap, tap } from 'rxjs';
import { environment } from 'environments/environment';
import { url } from 'inspector';

@Injectable({
    providedIn: 'root'
})
export class AnalyticsService {
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
        return this._httpClient.get('api/analytics').pipe(
            tap((response: any) => {
                this._data.next(response);
            })
        );
    }

    getProductData(): Observable<any> {
        return this._httpClient.get(environment.api + 'control/products').pipe(
            switchMap((response: any) => {
                return of(response);
            })
        );
    }

    getPrivate(url: any): Observable<any> {
        return this._httpClient.get(environment.api + url);
    }

    putPlayingData(url, data) {
        return this._httpClient.put(environment.api + url, data);
    }

    getPlayingData(url) {
        return this._httpClient.get(environment.api + url);
    }

    getProductByID(pid: any, endpoint: string): Observable<any> {
        // Get current product ID
        return this._httpClient.get(environment.api + endpoint).pipe(
            switchMap((response: any) =>
                // Return a new observable with the response
                of(response.find((v: any) => v.id === pid))
            )
        );
    }

    removePlayingData(removeUrl: any): Observable<any> {
        return this._httpClient.delete(environment.api + removeUrl);
    }

    uploadFile(uploadUrl: string, file: FormData): Observable<any> {
        return this._httpClient.post(environment.api + uploadUrl, file);
    }
}
