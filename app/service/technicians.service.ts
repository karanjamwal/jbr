import { Injectable } from '@angular/core';
import { Headers, RequestOptions, Http, Response } from '@angular/http';
import { User } from '../models/user';
import { Config } from './config';

declare let _: any;

@Injectable()
export class TechniciansService {
    constructor (private http: Http) {}

    _endpoint = Config.node_endpoint + "/documents/query";
    _authorizationToken = Config.auth_token;
    _techniciansKey: string = "stored_technicians";

    getTechnicians(): Promise<User[]> {
        let storedTechnicians = sessionStorage.getItem(this._techniciansKey);
        if (_.isNull(storedTechnicians)) {
            let headers = new Headers({
                'Content-Type': 'application/json',
                'Authorization': 'Token token=' + this._authorizationToken
            });
            let options = new RequestOptions({ headers: headers });
            let url = Config.node_endpoint + "/document/query";
            let queryParams = {
                parameters: [
                    {
                        property: "docType",
                        value: "user"
                    }, {
                        property: "role",
                        value: "Technician"
                    }
                ]};
            return this.http.post(url, queryParams, options).toPromise()
                .then(
                    response => {
                        let techs: User[] = this.extractData(response);
                        sessionStorage.setItem(this._techniciansKey, JSON.stringify(techs));
                        return techs;
                    }
                ).catch(this.handleError);
        } else {
            let techs: User[] = JSON.parse(storedTechnicians);
            let promise = new Promise<User[]>(function(resolve, reject) {
                resolve(techs);
            });
            return promise;
        }
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
