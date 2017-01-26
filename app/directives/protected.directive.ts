import { Directive, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { CookieService } from 'angular2-cookie';
import { AuthenticationService } from '../service/authentication.service';

declare let _: any;

@Directive({
    selector: '[protected]'
})

export class ProtectedDirective implements OnDestroy {
    private sub: any = null;

    constructor(private authService: AuthenticationService,
                private router: Router,
                private _cookieService: CookieService,
                private location: Location) {

        let userId = this._cookieService.get("userId");
        if (_.isUndefined(userId) || _.isNull(userId)) {
            this.location.replaceState('/login');
            this.router.navigate(['Login']);
        }
    }

    ngOnDestroy() {}
}
