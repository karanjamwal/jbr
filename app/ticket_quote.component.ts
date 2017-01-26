import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Ticket } from "./models/ticket";
import { User } from './models/user';
import { DocumentService } from "./service/document.service";
import { TicketService } from './service/ticket.service';
import { WorkDay } from "./models/workDay";

declare let moment: any;
declare let $: any;

@Component({
    selector: "ticket-details",
    styleUrls: ['lib/ticket_quote/ticket_quote.css'],
    templateUrl: 'app/ticket_quote.component.html'
})

export class TicketQuoteComponent {
    constructor(
        private _router: Router,
        private _documentService: DocumentService,
        private _ticketService: TicketService,
        private route: ActivatedRoute
    ) { }

    selectedTicket: Ticket;

    ngOnInit() {
        // Load the ticket

        let id = this.route.snapshot.params['id'];

        if (id != '') {
            // Show Progress
            $('#loadingProgressBar').show();
            this._documentService.getDocument(id)
                .then(ticket => {
                    this.selectedTicket = ticket;

                    $('#loadingProgressBar').hide();
                }).catch(
                error => {
                    console.log("There was a problem getting the ticket.");
                    $('#loadingProgressBar').hide();
                }
            );
        }
    }

    ngAfterViewInit() {
    }

    // UI Actions

}
