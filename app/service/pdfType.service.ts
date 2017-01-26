import { Injectable } from '@angular/core';
import { Headers, RequestOptions, Http, Response } from '@angular/http';
import { PdfType } from '../models/pdfType';
import { Config } from './config';

declare let _: any;

@Injectable()
export class PdfTypeService {
    constructor(private http: Http) { }

    _endpoint = Config.node_endpoint + "/document/";
    _authorizationToken = Config.auth_token;

    getPdfTypes(): Promise<PdfType[]> {
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Token token=' + this._authorizationToken
        });
        let options = new RequestOptions({ headers: headers, body: '' });

        return this.http.get(this._endpoint + "type/pdfType", options)
            .toPromise()
            .then(
                response => {
                    var pdfTypes: PdfType[] = this.extractData(response);
                    return pdfTypes;
                }
            )
            .catch(this.handleError)
    }

    private extractData(res: Response) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        let body = res.json();
        return body || {};
    }

    private handleError(error: any) {
        // In a real world app, we might send the error to remote logging infrastructure
        let errMsg = error.message || 'Server error';
        console.error(errMsg); // log to console instead
        return Promise.reject(errMsg);
    }
}
