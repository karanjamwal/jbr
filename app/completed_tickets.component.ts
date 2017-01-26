import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TicketService } from "./service/ticket.service";
import { SessionService } from "./service/session.service";
import { Ticket } from "./models/ticket";
import { User } from './models/user';

declare let DataTable: any;
declare let $: any;
declare let moment: any;
declare let _: any;

@Component({
    selector: "completed-tickets",
    templateUrl: 'app/completed_tickets.component.html'
})

export class CompletedTicketComponent implements OnInit {

    constructor(
        private _router: Router,
        private _ticketService: TicketService,
        private _sessionService: SessionService) { }

    tickets: Ticket[] = [];
    closedTickets = 0;

    ngOnInit() {
        // Fetch tickets
        this.fetchTickets();

        // LOADING ANIMATION
        $('#createLoadingProgressBar').show();
    }

    fetchTickets() {
        this._ticketService.getCompletedTickets().then(
            tickets => {

                // STOP ANIMATION
                $('#createLoadingProgressBar').hide();

                // Check for zero tickets returned
                if (_.isEmpty(tickets)) {
                    console.log("There are no completed tickets");
                    return;
                }

                this.tickets = tickets;

                // Populate default data for display
                this.tickets.forEach(ticket => {
                    // Check technician array
                    //technicians: {technician: technician, role: string}[]; // App-only
                    if (!_.has(ticket, 'technicians') || _.isEmpty(ticket.technicians)) {
                        // Instantiate technicians array
                        ticket.technicians = [];
                        let emptyTickTech = {
                            technician: new User(),
                            role: ""
                        };
                        ticket.technicians.push(emptyTickTech);
                    }
                });

                // For whatever reason we have to wait on Angular to template the data, and then execute DataTables
                let millisecondsToWait = 100;
                setTimeout(function() {
                    // Whatever you want to do after the wait
                    // Use jQuery and Datatables to build-out Grid UI
                    $('#dataTables-completedTickets').DataTable({
                        responsive: true,
                        order: [[ 2, "desc" ]]
                    });
                }, millisecondsToWait);
            },
            error => console.log("Error Fetching Tickets => " + error)
        );
    }

    goToTicketDetails(clickedTicket: Ticket) {
        this._router.navigate(['TicketDetails', {id: clickedTicket.id}]);
    }

    formatDate(date: string) {
        return moment(date).format("M/DD");
    }

    formatTechName(ticket: Ticket) {
        let tech = _.find(ticket.technicians, function(tech) {
            return !_.isUndefined(tech.technician);
        });

        return tech.technician.name;
    }
}
