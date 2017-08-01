import { Http } from '@angular/http';
import { Place } from '../models/Place';

import { Injectable } from '@angular/core';

@Injectable()
export class PlacesService {

    private _http:Http;
    private _serviceURL:string;

    constructor(http: Http) {
        this._http = http;
        this._serviceURL = 'http://localhost:8081';
    }

    getPlacesArround(latitude, longitude, callback:(places:Place[]) => void):void {

        let http:Http = this._http;
        let serviceURL:string = this._serviceURL;

        http.get(serviceURL + '/places?latitude=18.479495&longitude=-69.928324&type=restaurant&radius=1000').subscribe(function(response:any) {
            let places:Place[] = <Place[]> JSON.parse(response._body);
            
            if (callback) { callback(places) }
        });
             
    }
}