import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Ticket } from '../../app/models/ticket';
import { TicketAssignmentComponent } from '../../app/schedule_components/ticket_assignment.component';

declare let $: any;
declare let Bloodhound: any;
declare let moment: any;

@Component({
    selector: "my-unscheduled-tickets",
    styleUrls: ['lib/unscheduled_tickets/unscheduled_tickets.css'],
    templateUrl: 'app/schedule_components/unscheduled_tickets.component.html',
})

export class UnscheduledTicketsComponent implements OnInit {
    @Input() unscheduledTickets: Ticket[];
    @Input() ticketAssignmentComp: TicketAssignmentComponent;

    bodyHidden: boolean = false;

    ngOnInit() {
    }

    onBodyResize() {
        let bodyHeight = 0;
        $(".body > div").each(function(i) {
            bodyHeight += $(this).outerHeight(false);
            if(i >= 1) {
                bodyHeight += 2;
                return false;
            }
        });
        $('.body').height(bodyHeight);
    }

    onTicketClick(selectedTicket) {
        this.ticketAssignmentComp.openModal(selectedTicket);
    }

    toggleBody() {
        $('.body').toggleClass('hidden');
        this.bodyHidden = !this.bodyHidden;
    }
}
