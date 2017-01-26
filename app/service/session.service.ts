import { Injectable } from '@angular/core';
import { CookieService } from 'angular2-cookie';

declare let _: any;

@Injectable()
export class SessionService {
    constructor(private _cookieService: CookieService) {
    }

    userName() {
        if (this.hasUser()) {
            let user = this.getJsonUser();
            return user.name;
        }
        return '';
    }

    role() {
        if (this.hasUser()) {
            let user = this.getJsonUser();
            return user.role;
        }
        return '';
    }

    hasUser() {
        return !_.isUndefined(this._cookieService.getObject("signed-in-user")) &&
            !_.isNull(this._cookieService.getObject("signed-in-user"));
    }

    private getJsonUser() {
        return this._cookieService.getObject("signed-in-user");
    }
}
