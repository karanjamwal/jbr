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
    styleUrls: ['lib/ticket_details/ticket_details.css'],
    templateUrl: 'app/ticket_details.component.html'
})

export class TicketDetailsComponent {
    constructor(
        private _router: Router,
        private _documentService: DocumentService,
        private _ticketService: TicketService,
        private route: ActivatedRoute
    ) { }

    selectedTicket: Ticket;
    acknowledgedDateDisplay: string = "";
    isInEditMode: boolean = false;
    isInPrintMode: boolean = false;

    _editDescription: string = "";
    _editStatus: string = "";
    _editPriority: string = "";

    _currentImageUrl: string = "";

    ngOnInit() {
        // Load the ticket

        let id = this.route.snapshot.params['id'];

        // *** Double-check this logic, it may not work *** //
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
        // Is this the print preview page
        if (this.route.params['print'] === 'true') {
            this.isInPrintMode = true;
            $('.navbar').hide();
            $('.page-header').hide();
            let millisecondsToWait = 1000;
            setTimeout(function() {
                window.print();
            }, millisecondsToWait);
        }
    }

    initMagnificPopup() {
        $('.photo-collection').magnificPopup({
            delegate: 'a.photo',
            type: 'image',
            tLoading: 'Loading image #%curr%...',
            mainClass: 'mfp-img-mobile',
            gallery: {
                enabled: true,
                navigateByImgClick: true,
                preload: [0,1] // Will preload 0 - before current, and 1 after the current image
            },
            image: {
                tError: '<a href="%url%">The image #%curr%</a> could not be loaded.',
            }
        });
    }

    // UI Actions
    setStatusToOpen() {
        this._editStatus = "Open";
        $('#status-dropdown-span').text('Open');
    }

    setStatusToClosed() {
        this._editStatus = "Closed";
        $('#status-dropdown-span').text('Closed');
    }

    setStatusToInvoiced() {
        this._editStatus = "Invoiced";
        $('#status-dropdown-span').text('Invoiced');
    }

    setPriorityToRoutine() {
        this._editPriority = "Routine";
        $('#priority-dropdown-span').text('Routine');
    }

    setPriorityToEmergency() {
        this._editPriority = "Emergency";
        $('#priority-dropdown-span').text('Emergency');
    }

    editMode() {
        console.log("Going into edit mode");
        this.isInEditMode = true;

        // Prime the inputs
        this._editDescription = this.selectedTicket.workDescription;
    }

    saveEdits() {
        // Show the loading image and lock the buttons
        $('#loadingProgressBar').show();
        $('.edit-ticket-save-btn').prop("disabled",true);
        $('.edit-ticket-cancel-btn').prop("disabled",true);

        // Update the ticket
        this.selectedTicket.workDescription = (this._editDescription != "") ? this._editDescription: this.selectedTicket.workDescription;
        this.selectedTicket.status = (this._editStatus != "") ? this._editStatus: this.selectedTicket.status;

        // Send to the server
        // this._ticketService.updateTicket(this.selectedTicket)
        //     .then(ticket => {
        //         this.selectedTicket = ticket;
        //         this.isInEditMode = false;
        //         $('.edit-ticket-save-btn').prop("disabled",true);
        //         $('.edit-ticket-cancel-btn').prop("disabled",true);
        //         $('#loadingProgressBar').hide();
        //     }).catch(error => {
        //         console.log("There was an loading the crane.");
        //         alert("There was a problem updating the ticket.");

        //         this.isInEditMode = false;
        //         $('.edit-ticket-save-btn').prop("disabled",true);
        //         $('.edit-ticket-cancel-btn').prop("disabled",true);
        //         $('#loadingProgressBar').hide();
        //     });
    }

    cancelEdits() {
        console.log("Cancel edits");
        this.isInEditMode = false;
    }

    printTicket() {
        let currentUrl = window.location.href;
        window.open(currentUrl + '?print=true');
    }

    // UI Helper Functions
    formatTechName(technician: { technician: User, role: string }) {
        return technician.technician.name;
    }

    formatTechRole(technician: { technician: User, role: string }) {
        return technician.role;
    }

    formatDate(date: string = '') {
        return moment().format("DD MMM YYYY");
    }

    workTime(workDay: WorkDay) {
        let startTime = moment(workDay.startTime);
        let endTime;
        if (workDay.endTime != null && workDay.endTime != '') {
            endTime = moment(workDay.endTime);
        } else {
            endTime = moment();
        }
        let diffMins = endTime.diff(startTime, 'minutes');
        let workTime = `${Math.floor(diffMins / 60)}h ${diffMins % 60}m`;
        return workTime;
    }

    openModalWithImage(imageUrl) {
        this._currentImageUrl = imageUrl;
        this.openCloseModal();
    }

    openCloseModal() {
        // Use jquery to toggle modal
        $('#imagePreviewModal').modal('toggle');
    }

    openQuote() {
        this._router.navigate(['job', this.selectedTicket.id, 'quote']);
    }
}
