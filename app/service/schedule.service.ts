import { Injectable } from '@angular/core';
import { Headers, RequestOptions, Http, Response } from '@angular/http';
import { Schedule } from '../models/schedule';
import { Config } from './config';

@Injectable()
export class ScheduleService {
    constructor (private http: Http) {}

    _scheduleEndpoint = Config.node_endpoint + "/schedule";
    _authorizationToken = Config.auth_token;

    getSchedule(year, month): Promise<Schedule> {
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Token token=' + this._authorizationToken
        });
        let options = new RequestOptions({ headers: headers });
        let url = `${this._scheduleEndpoint}/${year}/${month}`;
        return this.http.get(url, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    private extractData(res: Response) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        let body = res.json();
        return body || { };
    }

    private handleError (error: any) {
        // In a real world app, we might send the error to remote logging infrastructure
        let errMsg = error.message || 'Server error';
        console.error(errMsg); // log to console instead
        return Promise.reject(errMsg);
    }
}
