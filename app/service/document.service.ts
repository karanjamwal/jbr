import { Injectable } from '@angular/core';
import { Headers, RequestOptions, Http, Response } from '@angular/http';

import { Config } from './config';

declare let _: any;

@Injectable()
export class DocumentService {
    constructor(private http: Http) { }

    _endpoint = Config.node_endpoint + "/document/";
    _authorizationToken = Config.auth_token;

    getDocument(id: string): Promise<any> {
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Token token=' + this._authorizationToken
        });
        let options = new RequestOptions({ headers: headers });
        let url = this._endpoint + id;
        return this.http.get(url, options)
            .toPromise()
            .then(
                response => {
                    var document: any = this.extractDataSingle(response);
                    return document;
                })
            .catch(this.handleError);
    }

    postDocument(document: string) {
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Token token=' + this._authorizationToken
        });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this._endpoint, document, options)
            .toPromise()
            .then(response => {
                var document: any = this.extractDataSingle(response);
                return document;
            }).catch(this.handleError);
    }

    putDocument(document: string): Promise<any> {
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Token token=' + this._authorizationToken
        });
        let options = new RequestOptions({ headers: headers });
        return this.http.put(this._endpoint, document, options)
            .toPromise()
            .then(response => {
                var document: any = this.extractDataSingle(response);
                return document;
            }).catch(this.handleError);
    }

    queryDocuments(queryParams): Promise<any> {
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Token token=' + this._authorizationToken
        });

        let body = JSON.stringify(queryParams);
        let options = new RequestOptions({ headers: headers });
        let url = Config.node_endpoint + "/document/query";

        return this.http.post(url, body, options).toPromise()
            .then(this.extractDataMultiple)
            .catch(this.handleError);
    }

    private extractDataMultiple(res: Response) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        let body = res.json();
        if (_.isArray(body)) {
            return body || [];
        }
        return body || [];
    }

    private extractDataSingle(res: Response) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        let body = res.json();
        if (_.isArray(body)) {
            return body[0] || {};
        }
        if (!_.isUndefined(body.data)) {
            return body.data;
        }
        return body || {};
    }

    private handleError(error: any) {
        // In a real world app, we might send the error to remote logging infrastructure
        let errMsg = error.message || 'Server error';
        console.error(errMsg); // log to console instead
        return Promise.reject(errMsg);
    }
}
