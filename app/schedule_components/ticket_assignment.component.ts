import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Ticket } from '../../app/models/ticket';
import { User } from '../../app/models/user';

// JS library hacks
declare let $: any;
declare let Bloodhound: any;
declare let Pikaday: any;
declare let moment: any;
declare let _: any;

@Component({
    selector: "ticket-assignment",
    templateUrl: 'app/schedule_components/ticket_assignment.component.html'
})

export class TicketAssignmentComponent implements OnInit {
    constructor(private _router: Router) { }

    @Input() selectedTicket: Ticket;
    @Output() onTicketUpdated = new EventEmitter();

    primaryTech: User = new User();
    assistantTechs: User[] = [];

    ngOnInit() {
        // Configure the start date
        let startPicker = $('#startDate').pikaday({ format: 'MM/DD/YYYY' });
        let endPicker = $('#endDate').pikaday({ format: 'MM/DD/YYYY' });
    }

    openModal(ticket: Ticket) {
        // If ticket is invalid do nothing
        if (_.isNull(ticket))
            return;

        this.selectedTicket = ticket;

        // Get the users timezone
        let defaultTimeZone = moment.tz.guess();

        // If there's a job start then seed the calendar
        if (!_.isUndefined(this.selectedTicket.jobStart)) {
            let startDateLocal = new Date(this.selectedTicket.jobStart);
            let startDate = new Date(startDateLocal.valueOf() + startDateLocal.getTimezoneOffset() * 60000);
            let startDateString = moment(startDate).tz(defaultTimeZone).format('MM/DD/YYYY');
            $('#startDate').val(startDateString);
        } else {
            $('#startDate').val('');
        }

        // If there's a job end then seed the calendar
        if (!_.isUndefined(this.selectedTicket.jobEnd)) {
            let endDateLocal = new Date(this.selectedTicket.jobEnd);
            let endDate = new Date(endDateLocal.valueOf() + endDateLocal.getTimezoneOffset() * 60000);
            let endDateString = moment(endDate).tz(defaultTimeZone).format('MM/DD/YYYY');
            $('#endDate').val(endDateString);
        } else {
            $('#endDate').val('');
        }

        // Set local values for ticket
        this.assistantTechs = [];
        this.primaryTech = new User();
        if (_.has(this.selectedTicket, 'technicians')) {
            // Set primary tech
            let filteredTicketPrimary = _.filter(this.selectedTicket.technicians, function(t) {
                return t.role == "Primary";
            });
            if (filteredTicketPrimary.length > 0) {
                this.primaryTech = filteredTicketPrimary[0].technician;
            }

            // Set assistant techs
            let filteredTicketAssistants = _.filter(this.selectedTicket.technicians, function(t) {
                return t.role == "Assistant";
            });
            if (filteredTicketAssistants.length > 0) {
                this.assistantTechs = _.map(filteredTicketAssistants, function(t) {
                    return t.technician;
                });
            }
        }

        // Use jquery to trigger modal
        $('#ticketAssignmentModal').modal();
    }

    closeModal() {
        // Clear Typeaheads
        $('#typeaheadPrimaryTech .typeahead').typeahead('val', '');
        $('#typeaheadAssistantTechs .typeahead').typeahead('val', '');

        // Use jquery to toggle modal
        $('#ticketAssignmentModal').modal('toggle');
    }

    ticketUpdated() {
        // Update selected ticket
        let ticketTechnicians: {technician: any, role: string}[] = [];

        // Primary
        if (this.primaryTech.name != "" && this.primaryTech.id != "") {
            ticketTechnicians.push({
                technician: {
                    id: this.primaryTech.id,
                    name: this.primaryTech.name
                },
                role: "Primary"
            });
        }

        // Assistants
        this.assistantTechs.forEach(tech => {
            ticketTechnicians.push({
                technician: tech,
                role: "Assistant"
            });
        });

        // Technicians
        this.selectedTicket.technicians = ticketTechnicians;

        // Get the users timezone
        let defaultTimeZone = moment.tz.guess();

        // Start Date
        let startDate = new Date($('#startDate').val());
        let startDateStr = moment(startDate).tz(defaultTimeZone).format("YYYY-MM-DD");
        this.selectedTicket.jobStart = startDateStr;

        // End Date
        let endDate = new Date($('#endDate').val());
        let endDateStr = moment(endDate).tz(defaultTimeZone).format("YYYY-MM-DD");
        this.selectedTicket.jobEnd = endDateStr;

        // Execute function
        this.onTicketUpdated.emit(this.selectedTicket);

        // Close self
        this.closeModal();
    }

    goToTicketDetails(clickedTicket: Ticket) {
        // Use jquery to toggle modal
        $('#ticketAssignmentModal').modal('toggle');

        this._router.navigate(['job', clickedTicket.id]);
    }
}
