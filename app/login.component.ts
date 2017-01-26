import { Component, Input, Output, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { AuthenticationService } from './service/authentication.service';
import { UserService } from './service/user.service';
import { AbstractControl, NgControl } from "@angular/forms";
import { CookieService } from 'angular2-cookie';
import { Config } from "./service/config";

import * as CryptoJS from 'crypto-js';

declare let $: any;
declare let pushpad: any;

@Component({
    selector: "login",
    styleUrls: ['lib/login/login.css'],
    templateUrl: 'app/login.component.html'
})

export class LogInComponent implements OnInit {
    userEmail: string = '';
    userPassword: string = '';
    @ViewChild('email') emailInput;
    @ViewChild('password') passwordInput;
    @ViewChild('signinButton') signinButton;
    attempts: number = 0;
    isInAttempt: boolean = false;

    constructor(
        private _router: Router,
        private _authenticationService: AuthenticationService,
        private _userService: UserService,
        private _cookieService: CookieService,
        private router: Router,
        private location: Location) {
    }

    ngOnInit() {
        // Before doing anything, rewrite to SSL
        if (window.location.protocol != "https:" && window.location.hostname != "localhost") {
            window.location.href = "https:" + window.location.href.substring(window.location.protocol.length);
            return;
        }
    }

    logIn(email, password) {
        this.isInAttempt = true;
        this.attempts++;
        $('#signinButton').html("&nbsp;<i class='fa fa-circle-o-notch fa-spin'></i>&nbsp;");

        this._authenticationService.authenticateUser(email, password)
            .then(userId => {
                this._cookieService.put("userId", userId);
                this._userService.setSignedInUserGlobally()
                    .then(user => {
                        // Remove the password
                        let cookieSafeUser = {
                            docType: "user",
                            email: user.email,
                            id: user.id,
                            name: user.name,
                            role: user.role,
                        };
                        this._cookieService.putObject("signed-in-user", JSON.stringify(cookieSafeUser));
                        // Send the signal notifying a user has authenticated
                        this._authenticationService.signalAuthenticatedUser(user);

                        let hmac = CryptoJS.HmacSHA1(userId, Config.pushpad_auth_token);
                        pushpad('subscribe', function (isSubscribed) {
                            if (!isSubscribed)
                                alert('Please enable push notifications from your browser preferences to be notified from technicians.');
                        }, {
                            tags: [user.role],
                            uid: user.id,
                            uidSignature: hmac.toString(),
                        });
                    })
                    .catch(error => {
                        this.markAsPristine(this.emailInput);
                        this.markAsPristine(this.passwordInput);
                        $('#signinButton').html("Sign In");
                        this.isInAttempt = false;
                    });
                this.router.navigate(['dashboard']);
            })
            .catch(error => {
                this.markAsPristine(this.emailInput);
                this.markAsPristine(this.passwordInput);
                $('#signinButton').html("Sign In");
                this.isInAttempt = false;
            });
    }
    //
    // markAsPristine(control: AbstractControl) {
    // 	control['_pristine'] = true;
    // }

    markAsPristine(control: NgControl) {
        control.control['_pristine'] = true;
    }
}
