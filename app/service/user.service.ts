import { Injectable } from '@angular/core';
import { Headers, RequestOptions, Http, Response } from '@angular/http';
import { CookieService } from 'angular2-cookie';
import { User } from '../models/user';
import { Config } from './config';

declare let _: any;

@Injectable()
export class UserService {
    constructor(private http: Http,
                private _cookieService: CookieService,) { }

    _endpoint = Config.node_endpoint + "/document/";
    _authorizationToken = Config.auth_token;

    setSignedInUserGlobally(): Promise<User> {
        let userId = this._cookieService.get("userId");

        let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Token token=' + this._authorizationToken
        });
        let options = new RequestOptions({ headers: headers, body: '' });

        return this.http.get(this._endpoint + userId , options)
            .toPromise()
            .then(
                response => {
                    let extractedData = this.extractData(response);
                    let user: User = extractedData;
                    return user;
                })
            .catch(this.handleError);
    }

    getUsers(): Promise<User[]> {
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Token token=' + this._authorizationToken
        });
        let options = new RequestOptions({ headers: headers, body: '' });

        return this.http.get(this._endpoint + "type/user", options)
            .toPromise()
            .then(
                response => {
                    let users: User[] = this.extractData(response);
                    return users;
                }
            )
            .catch(this.handleError)
    }

    addUser(user: User): Promise<User> {
        let body = JSON.stringify(user);
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Token token=' + this._authorizationToken
        });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this._endpoint, body, options)
            .toPromise()
            .then(this.extractPostPutData)
            .catch(this.handleError);
    }

    updateUser (user: User): Promise<User> {
        let body = JSON.stringify(user);
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Token token=' + this._authorizationToken
        });
        let options = new RequestOptions({ headers: headers });
        return this.http.put(this._endpoint, body, options)
            .toPromise()
            .then(this.extractPostPutData)
            .catch(this.handleError);
    }

    deleteUser (user: User): Promise<User> {
        let body = JSON.stringify(user);
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Token token=' + this._authorizationToken,
        });
        let options = new RequestOptions({ headers: headers, body: body });
        return this.http.delete(this._endpoint, options)
            .toPromise()
            .then(this.extractPostPutData)
            .catch(this.handleError);
    }

    private extractData(res: Response) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        let body = res.json();
        return body || {};
    }

    private extractPostPutData(res: Response) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        let body = res.json();
        return body.data || { };
    }

    private handleError(error: any) {
        // In a real world app, we might send the error to remote logging infrastructure
        let errMsg = error.message || 'Server error';
        console.error(errMsg); // log to console instead
        return Promise.reject(errMsg);
    }
}
