import { Component, OnInit, ViewContainerRef, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Overlay, overlayConfigFactory } from 'angular2-modal';
import { TicketService } from "./service/ticket.service";
import { SessionService } from "./service/session.service";
import { Ticket } from "./models/ticket";
import { User } from './models/user';
import { Modal, BSModalContext } from "angular2-modal/plugins/bootstrap";

import { CreateTicketModalContext, CreateTicketModalComponent } from './create_ticket_modal.component';
import { SocketService } from './Service/SocketService';

declare let DataTable: any;
declare let $: any;
declare let moment: any;
declare let _: any;

@Component({
    selector: "my-dashboard",
    templateUrl: 'app/dashboard.component.html',
    providers: [Modal, SocketService],
})

export class DashboardComponent implements OnInit {
    constructor(
        private _router: Router,
        vcRef: ViewContainerRef,
        overlay: Overlay,
        private _ticketService: TicketService,
        private _sessionService: SessionService,
        private _socketService : SocketService,
        public modal: Modal) {
        overlay.defaultViewContainer = vcRef;
    }

    tickets: Ticket[] = [];
    panels: Panel[] = [];
    selectedPanelIndex = 0;
    hideSuspendedNotification: boolean = false;
    hideSubmittedNotification: boolean = false;
    hideApprovedNotification: boolean = false;

    ngOnInit() {
        // Fetch tickets
        this.fetchTickets();
        $('#createLoadingProgressBar').show();

        this.panels.push(
            new Panel({
                className: 'panel-yellow',
                icon: 'fa-calendar-check-o',
                title: 'Open Jobs',
                tickets: [],
            }),
            new Panel({
                className: 'panel-green',
                icon: 'fa-calendar-check-o',
                title: 'Jobs Opened This Week',
                tickets: [],
            }),
            new Panel({
                className: 'panel-orange',
                icon: 'fa-calendar-times-o',
                title: 'Jobs Closed This Week',
                tickets: [],
            }),
            new Panel({
                className: 'panel-red',
                icon: 'fa-calendar-times-o',
                title: 'Jobs Closed This Month',
                tickets: [],
            }),
        );

        this._socketService.get("ticket-suspended");
    }

    // MARK: UI Methods
    goToTicketDetails(clickedTicket: Ticket) {
        // TODO: Turn This Back On Later
        this._router.navigate(['job', clickedTicket.id]);
    }

    // MARK: Filters
    isOpen(ticket: Ticket) {
        let now = moment();
        let range  = moment.range(ticket.jobStart, ticket.jobEnd);
        return range.contains(now);
    }

    isOpenedThisWeek(ticket: Ticket) {
        let startOfWeek = moment().startOf('isoWeek');
        let endOfWeek = moment().endOf('isoWeek');
        let range  = moment.range(startOfWeek, endOfWeek);
        return range.contains(moment(ticket.jobStart));
    }

    isClosedThisWeek(ticket: Ticket) {
        let startOfWeek = moment().startOf('isoWeek');
        let endOfWeek = moment().endOf('isoWeek');
        let range  = moment.range(startOfWeek, endOfWeek);
        return range.contains(moment(ticket.jobEnd));
    }

    isClosedThisMonth(ticket: Ticket) {
        let startOfWeek = moment().startOf('month');
        let endOfWeek = moment().endOf('month');
        let range  = moment.range(startOfWeek, endOfWeek);
        return range.contains(moment(ticket.jobEnd));
    }

    isSuspended(ticket: Ticket) {
        return ticket.status == 'Suspended';
    }

    isSubmitted(ticket: Ticket) {
        return ticket.status == 'Submitted For Approval';
    }

    isApproved(ticket: Ticket) {
        return ticket.status == 'Approved';
    }

    // MARK: Helpers
    fetchTickets() {
        this._ticketService.getTickets().then(
            tickets => {
                // STOP LOADING ANIMATION
                $('#createLoadingProgressBar').hide();

                // Check for zero tickets returned
                if (_.isEmpty(tickets)) {
                    console.log("There are no tickets");
                    return;
                }

                this.tickets = tickets.filter(this.isOpen);
                console.log("Open Tickets");
                console.log(this.tickets);
                this.panels[0].tickets = tickets.filter(this.isOpen);
                this.panels[1].tickets = tickets.filter(this.isOpenedThisWeek);
                this.panels[2].tickets = tickets.filter(this.isClosedThisWeek);
                this.panels[3].tickets = tickets.filter(this.isClosedThisMonth);

                // Populate default data for display
                this.tickets.forEach(ticket => {
                    // Check technician array
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
                const millisecondsToWait = 100;
                setTimeout(function() {
                    // Whatever you want to do after the wait
                    // Use jQuery and Datatables to build-out Grid UI
                    $('#dataTables-dashboard').DataTable({
                        responsive: true,
                        order: [[ 2, "desc" ]],
                        oLanguage: {
                            sLengthMenu: "_MENU_",
                            sSearch: "<i class='fa fa-search'></i>",
                            oPaginate: {
                                sFirst: "First",
                                sLast: "Last",
                                sNext: "<img src='/assets/images/dashboard/right_angle.png'>",
                                sPrevious: "<img src='/assets/images/dashboard/left_angle.png'>",
                            },
                        },
                    });

                    $('.dataTables_wrapper > div:first-child').removeClass('row');
                    $('.dataTables_wrapper > div:first-child').addClass('clearfix');
                    $('.dataTables_wrapper > div:first-child > div:first-child').before($('.dataTables_wrapper > div:first-child > div:last-child'));
                    $('.dataTables_filter > label > input').attr("placeholder", "Search");

                    $("select[name='dataTables-dashboard_length']").selectpicker({
                        style: 'btn-tbl-length',
                        size: 4
                    });
                    $('.dataTables_wrapper > div:last-child > div:first-child').addClass('hidden');
                    $('.dataTables_wrapper > div:last-child > div:last-child').removeClass('col-sm-6');
                    $('.dataTables_wrapper > div:last-child > div:last-child').addClass('col-sm-12');
                    $('.data_wrapper').after($('.dataTables_wrapper > div:last-child'));
                    $('.dataTables_length > label > div > button').html(function(i,h){
                        return h.replace(/&nbsp;/g,'');
                    });
                    $('.dataTables_length > label > div > button > span:last-child').replaceWith("<i class='fa fa-angle-down'></i>");
                    $('.dataTables_length > label > div > button > span:first-child').removeClass('pull-left');
                    $('.dataTables_length > label > div > button > span:first-child').before("<span>Show</span>");
                }, millisecondsToWait);
            },
            error => console.log("Error Fetching Tickets => " + error)
        );
    }

    formatDateOpened(dateOpened: string) {
        return moment(dateOpened).format("M/DD");
    }

    formatTechName(ticket: Ticket) {
        let tech = _.find(ticket.technicians, function(tech) {
            return !_.isUndefined(tech.technician);
        });
        if(tech) {
            return tech.technician.name;
        } else {
            return '';
        }
    }

    // MARK: Events
    onPanelSelected(panel: Panel, index) {
        this.selectedPanelIndex = index;
        this.tickets = panel.tickets;
    }

    addTicketClick() {
        return this.modal.open(
            CreateTicketModalComponent,
            overlayConfigFactory({ isBlocking: false }, BSModalContext)
        );
    }

    closeSuspendedNotification() {
        this.hideSuspendedNotification = true;
    }

    closeSubmittedNotification() {
        this.hideSubmittedNotification = true;
    }

    closeApprovedNotification() {
        this.hideApprovedNotification = true;
    }
}

class Panel {
    className: string;
    icon: string;
    title: string;
    tickets: Ticket[];

    constructor(
        fields?: {
            className?: string;
            icon?: string;
            title?: string;
            tickets?: Ticket[];
        }) {
        if (fields) Object.assign(this, fields);
    }
}
