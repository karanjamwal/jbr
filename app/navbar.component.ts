import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { CookieService } from 'angular2-cookie';
import { AuthenticationService } from './service/authentication.service';
import { Ticket } from "./models/ticket";
import { TicketService } from '../app/service/ticket.service';
import { SessionService } from '../app/service/session.service';
import { TechniciansService } from '../app/service/technicians.service';
import { CustomersService } from '../app/service/customer.service';

declare let _: any;
declare let $: any;
declare let pushpad: any;

@Component({
    selector: 'navbar',
    templateUrl: 'app/navbar.component.html'
})

export class Navbar implements OnInit {
    constructor(private location: Location,
                private router: Router,
                private authService: AuthenticationService,
                private _ticketService: TicketService,
                private _sessionService: SessionService,
                private _cookieService: CookieService,
                private _technicianservice: TechniciansService,
                private _customerService: CustomersService) {
    }

    completedTickets: Ticket[];
    userName: string = "";
    userRole: string = "";
    currentNav = 'dashboard';

    ngOnInit() {
        if (this._sessionService.hasUser()) {
            console.log("Session has a user");
            this.userName = this._sessionService.userName();
            this.userRole = this._sessionService.role();
        } else {
            // Set the user's name
            if (!_.isUndefined(this._cookieService.getObject("signed-in-user")) &&
                !_.isNull(this._cookieService.getObject("signed-in-user"))) {
                let user = JSON.parse(this._cookieService.getObject("signed-in-user"));
                this.userName = user.name;
                this.userRole = user.role;
                // Use jquery to force update
                $('#userNameLabel').text(user.name);
                user.role == 'Executive' ? $('#users-li').show(): $('#users-li').hide();
            }
        }

        // Pre-fetch technicians
        this._technicianservice.getTechnicians()
            .then(
                technicians => {
                    console.log("Successfully retrieved technicians");
                }
            );

        // Pre-fetch customers
        this._customerService.getCustomers()
            .then(
                customers => {
                    console.log("Successfully retrieved customers");
                }
            );

        // Fetch completed tickets
        this._ticketService.getCompletedTickets().then(
            tickets => {
                // Check for zero tickets returned
                if (_.isEmpty(tickets)) {
                    console.log("There are no completed tickets");
                    return;
                }
                this.completedTickets = tickets;
            },
            error => console.log("Error Fetching Tickets => " + error)
        );

    }

    onNavSelected(nav) {
        this.currentNav = nav;
    }

    onLogout() {
        pushpad('unsubscribe');

        this._cookieService.remove("userId");
        this._cookieService.remove("signed-in-user");
        window.sessionStorage.removeItem("stored_customers");
        window.sessionStorage.removeItem("stored_technicians");
        this.router.navigate(['login']);
    }
}
