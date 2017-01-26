import { Injectable, Output, EventEmitter } from '@angular/core';
import { Headers, RequestOptions, Http, Response } from '@angular/http';
import { User } from '../models/user';
import { Config } from './config';

declare let sjcl: any;

@Injectable()
export class AuthenticationService {

    @Output() userAuthenticatedEvent = new EventEmitter<User>();

    constructor(private http: Http) { }

    _authEndpoint = Config.node_endpoint + "/auth";
    _authorizationToken = Config.auth_token;

    authenticateUser(email: string, password: string): Promise<string> {

        sjcl.beware["CBC mode is dangerous because it doesn't protect message integrity."]();
        let key = sjcl.codec.utf8String.toBits("873e923c756a712b");
        let iv = sjcl.codec.utf8String.toBits("e87f12384b93e78c");

        let secret = `${email}~${password}`;
        let crypto = new sjcl.cipher.aes(key);
        let cipherText = sjcl.mode.cbc.encrypt(crypto, sjcl.codec.utf8String.toBits(secret), iv);
        let base64String = sjcl.codec.base64.fromBits(cipherText);

        let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Token token=' + this._authorizationToken
        });
        let options = new RequestOptions({ headers: headers });

        let body = {
            "cipher": base64String
        };
        let bodyString = JSON.stringify(body);

        return this.http.post(this._authEndpoint, bodyString, options)
            .toPromise()
            .then (
                response => {
                    let body = response.json();
                    return body.userId;
                }
            )
            .catch(this.handleError);
    }

    signalAuthenticatedUser(user: User) {
        this.userAuthenticatedEvent.emit(user);
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
