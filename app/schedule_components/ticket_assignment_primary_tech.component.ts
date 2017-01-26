import { Component, AfterViewInit, OnChanges, Input } from '@angular/core';
import { User } from '../../app/models/user';
import { TechniciansService } from '../../app/service/technicians.service';

declare let $: any; // jQuery
declare let Bloodhound: any;
declare let _: any;

@Component({
    selector: "ticket-assignment-primary-tech",
    templateUrl: 'app/schedule_components/ticket_assignment_primary_tech.component.html'
})

export class PrimaryTechComponent implements AfterViewInit, OnChanges {
    constructor(
        private _technicianService: TechniciansService) { }

    @Input() primaryTech: User;
    technicians: User[];

    ngAfterViewInit() {
        // Initialize the typeaheads
        this._technicianService.getTechnicians()
            .then(
                technicians => {
                    this.technicians = technicians;
                    let techNames = _.map(technicians, 'name');
                    let techSource = new Bloodhound({
                        datumTokenizer: Bloodhound.tokenizers.whitespace,
                        queryTokenizer: Bloodhound.tokenizers.whitespace,
                        local: techNames
                    });

                    $('#typeaheadPrimaryTech .typeahead').typeahead({
                            hint: true,
                            highlight: true,
                            minLength: 1
                        },
                        {
                            name: 'techSource',
                            source: techSource
                        });

                    // Bind typeahead events
                    $('#typeaheadPrimaryTech .typeahead').bind('typeahead:select', this.typeaheadSelectionMade);
                }
            );
    }

    ngOnChanges() {
        // UI
        if (_.isEmpty(this.primaryTech.name)) {
            this.showTypeahead();
        } else {
            this.hideTypeahead();
        }
    }

    showTypeahead() {
        $('#typeaheadPrimaryTech').show();
        $('#primaryTechContainer').hide();
    }

    hideTypeahead() {
        $('#typeaheadPrimaryTech').hide();
        $('#primaryTechContainer').show();
    }

    typeaheadSelectionMade(ev, technician) {
        // UI
        $('#primarySelected').val(technician);

        // Click the button to re-enter Angular scope
        $('#primarySelectedButton').click();
    }

    // MARK: Hacking Angular 2 to stay within scope
    primarySelectedButton() {
        let technician = $('#primarySelected').val();

        // Match Typeahead value with object
        let tech: User = _.find(this.technicians, function(t) {
            return t.name == technician;
        });

        // Update the primary tech
        this.primaryTech.name = tech.name;
        this.primaryTech.id = tech.id;

        // Hide typeahead, show label
        $('#typeaheadPrimaryTech').hide();
        $('#primaryTechContainer').show();
    }

    // MARK: Events on View
    removePrimaryTech() {
        // Clear the input
        $('#typeaheadPrimaryTech .typeahead').typeahead('val', '');
        this.showTypeahead();

        this.primaryTech.name = "";
        this.primaryTech.id = "";
    }
}
