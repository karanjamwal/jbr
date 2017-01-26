import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { GuidService } from '../app/service/guid.service';
import { User } from "./models/user";
import { SessionService } from '../app/service/session.service';
import { UserService } from '../app/service/user.service';
import { AppComponent } from '../app/app.component';

@Component({
    selector: 'create-user',
    templateUrl: 'app/create_user.component.html'
})
export class CreateUserComponent implements OnInit {
    constructor(
        private _router: Router,
        private _sessionService: SessionService,
        private _userService: UserService,
        private _guidService: GuidService) {
        this.user = new User();
        this.user.docType = "user";
    }
    active = true;

    @Input() user: User;

    ngOnInit() { }

    createUser() {
        this.active = false;
        $('#createButton').addClass('disabled');
        $('#progressBar').show();

        this.user.id = this._guidService.guid();

        //Post object
        this._userService.addUser(this.user).then(
            data => {
                console.log("User Added!");
                this.active = true;
                $('#createButton').removeClass('disabled');
                $('#progressBar').hide();

                this._router.navigate(['users']);
            },
            error => console.log("Error Adding User =>" + error)
        );
    }
}
