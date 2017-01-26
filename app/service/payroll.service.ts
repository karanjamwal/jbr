import { Injectable } from '@angular/core';
import { Headers, RequestOptions, Http, Response } from '@angular/http';
import { Config } from './config';

@Injectable()
export class PayrollService {
    constructor (private http: Http) {}

    _endpoint = Config.node_endpoint + "/payroll";
    _authorizationToken = Config.auth_token;

    getSchedule (year, month): Promise<any> {
        // let headers = new Headers({
        //     'Content-Type': 'application/json',
        //      'Authorization': 'Token token=' + this._authorizationToken
        // });
        // let options = new RequestOptions({ headers: headers });
        // let requestUrl = `${this._endpoint}/${year}/${month}`;
        // return this.http.get(requestUrl, options)
        //     .toPromise()
        //     .then(this.extractData)
        //     .catch(this.handleError);
        return new Promise((resolve, reject) => {
            resolve();
        });
    }

    updateWorkDay (updateParams: any): Promise<any> {
        let body = JSON.stringify(updateParams);
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Token token=' + this._authorizationToken
        });
        let requestUrl = `${this._endpoint}/workday`;
        let options = new RequestOptions({ headers: headers });
        return this.http.put(requestUrl, body, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    updateTicketWorkDay (updateParams: any): Promise<any> {
        let body = JSON.stringify(updateParams);
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Token token=' + this._authorizationToken
        });
        let requestUrl = `${this._endpoint}/ticket`;
        let options = new RequestOptions({ headers: headers });
        return this.http.put(requestUrl, body, options)
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
