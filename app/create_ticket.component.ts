import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { Form } from '@angular/forms';
import {Router, Params, ActivatedRoute} from '@angular/router';
import { Ticket } from "./models/ticket";
import { DocumentService } from "./service/document.service";
import { SessionService } from '../app/service/session.service';
import { Customer } from './models/customer';

declare let $: any;
declare let _: any;
declare let Bloodhound: any;

@Component({
    selector: "my-create-ticket",
    templateUrl: 'app/create_ticket.component.html'
})

export class CreateTicketComponent implements AfterViewInit {
    constructor(
        private _router: Router,
        private _documentService: DocumentService,
        private _route: ActivatedRoute,
        private _sessionService: SessionService) {
        this.ticket = new Ticket();
    }

    @Input() ticket: Ticket;
    isCreateButtonActive: boolean = true;

    customers: Customer[] = JSON.parse(window.sessionStorage.getItem("stored_customers"));

    ngOnInit() {
        this._route.params.forEach((params: Params) => {
            this.ticket.poNumber = params['poNumber'] != null && params['poNumber'] != 'null' ? params['poNumber'] : '';
            this.ticket.woNumber = params['woNumber'] != null && params['woNumber'] != 'null' ? params['woNumber'] : '';
            // this.ticket.customer.customerName = params['customerName'];
            this.ticket.workDescription =
                params['workDescription'] != null && params['workDescription'] != 'null' ?
                    params['workDescription'] : '';
            // this.ticket.jobStart = params['jobStart'];
            this.ticket.pdfUrl = params['pdfUrl'];
        });
    }

    createTicket() {
        // Disable the button
        $('#createButton').addClass('disabled');
        $('#createLoadingProgressBar').show();

        // Set default values
        this.ticket.dateOpened = new Date().toISOString();
        this.ticket.status = "Open";
        let selectedCustomer = this.customers.filter(x=>x.customerName == $('#customerSelected').val())[0];
        this.ticket.customer = selectedCustomer;

        //Post object
        let document = JSON.stringify(this.ticket);
        this._documentService.postDocument(document).then(
            data => {
                // Route to dashboard
                console.log("Ticket Added!");
                this._router.navigate(['job/schedule']);
            },
            error => console.log("Error Adding Ticket =>" + error)
        );
    }

    ngAfterViewInit() {
        // Initialize the typeaheads
        let customerNames = _.map(this.customers, 'customerName');
        let customerSource = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.whitespace,
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            local: customerNames
        });
        $('#typeaheadCustomers .typeahead').typeahead({
                hint: true,
                highlight: true,
                minLength: 1
            },
            {
                name: 'customerSource',
                source: customerSource
            });

        // Bind typeahead events
        $('#typeaheadCustomers .typeahead').bind('typeahead:select', this.typeaheadSelectionMade);
    }

    // MARK: Hacking Angular 2 to stay within scope
    customerSelectedButton() {
        let customer = $('#customerSelected').val();

        // Make sure the customer is not already selected
        let preExistingCustomer = _.find(this.customers, function(c) {
            return c.customerName == customer;
        });

        // Customer already exists, return
        if (!_.isUndefined(preExistingCustomer)) {
            return;
        }

        // Match Typeahead value with object
        let cust: Customer = _.find(this.customers, function(c) {
            return c.customerName == customer;
        });

        // Trim out the unnecessary values
        let custObj: Customer = new customer();
        custObj.customerListId = cust.customerListId;
        custObj.customerName = cust.customerName;

        // Add the tech to list
        this.customers.push(custObj);

        // Clear the typeahead input
        $('#typeaheadCustomers .typeahead').typeahead('val', '');
    }

    showTypeahead() {
        $('#typeaheadCustomer').show();
        $('#customerContainer').hide();
    }

    hideTypeahead() {
        $('#typeaheadCustomer').hide();
        $('#customerContainer').show();
    }

    typeaheadSelectionMade(ev, customer) {
        // Set the hidden input to store the value
        $('#customerSelected').val(customer);

        // Click the button to re-enter Angular scope
        $('#customerSelectedButton').click();
    }
}
