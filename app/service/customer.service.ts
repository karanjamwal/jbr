import { Injectable } from '@angular/core';
import { Headers, RequestOptions, Http, Response } from '@angular/http';
import { Customer } from '../models/customer';
import { Config } from './config';

declare let _: any;

@Injectable()
export class CustomersService {
    constructor (private http: Http) {}

    _authorizationToken = Config.auth_token;
    _customerKey: string = "stored_customers";

    getCustomers(): Promise<Customer[]> {
        let storedCustomers = sessionStorage.getItem(this._customerKey);
        if (_.isNull(storedCustomers)) {
            let headers = new Headers({
                'Content-Type': 'application/json',
                'Authorization': 'Token token=' + this._authorizationToken
            });
            let options = new RequestOptions({
                headers: headers,
                body: ''
            });
            let url = `${Config.node_endpoint}/document/type/customer`;
            return this.http.get(url, options)
                .toPromise()
                .then(
                    response => {
                        var customers: Customer[] = this.extractData(response);
                        sessionStorage.setItem(this._customerKey, JSON.stringify(customers));
                        return customers;
                    }
                ).catch(this.handleError);
        } else {
            let customers: Customer[] = JSON.parse(storedCustomers);
            let promise = new Promise<Customer[]>(function(resolve, reject) {
                resolve(customers);
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

    private handleError(error: any) {
        // In a real world app, we might send the error to remote logging infrastructure
        let errMsg = error.message || 'Server error';
        console.error(errMsg); // log to console instead
        return Promise.reject(errMsg);
    }
}
