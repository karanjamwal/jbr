import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'angular2-cookie';

import { SessionService } from './service/session.service';
import { TechniciansService } from './service/technicians.service';
import { CustomersService } from './service/customer.service';
import { AuthenticationService } from './service/authentication.service';
import { Config } from './service/config'

declare let moment: any;
declare let _: any;
declare let pushpad: any;

@Component({
    selector: "my-app",
    templateUrl: 'app/app.component.html',
})

export class AppComponent implements OnInit {
    constructor(
        private _technicianService: TechniciansService,
        private _customerService: CustomersService,
        private _sessionService: SessionService,
        private _authenticationService: AuthenticationService,
        private _cookieService: CookieService,
        private _router: Router) {
    }

    title = "Scott Services Ticket Dashboard";
    userRole = "";

    ngOnInit() {
        console.log("Hello Scott");

        pushpad('init', Config.pushpad_project_id);

        // Before doing anything, rewrite to SSL
        if (window.location.protocol != "https:" && window.location.hostname != "localhost") {
            window.location.href = "https:" + window.location.href.substring(window.location.protocol.length);
            return;
        }

        // Listen for auth changes
        this._authenticationService.userAuthenticatedEvent.subscribe(user => {
            this.userRole = user.role;
        });

        this.userRole = this._sessionService.role();
    }

    isAuthenticated() {
        let userId = this._cookieService.get("userId");
        return !_.isUndefined(userId) && !_.isNull(userId);
    }
}
