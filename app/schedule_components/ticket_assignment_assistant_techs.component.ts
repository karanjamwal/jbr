import { Component, AfterViewInit, Input } from '@angular/core';
import { User } from '../../app/models/user';
import { TechniciansService } from '../../app/service/technicians.service';

declare let $: any; // jQuery
declare let Bloodhound: any;
declare let _: any;

@Component({
    selector: "ticket-assignment-assistant-techs",
    templateUrl: 'app/schedule_components/ticket_assignment_assistant_techs.component.html'
})

export class AssistantTechsComponent implements AfterViewInit {
    constructor(
        private _technicianservice: TechniciansService) { }

    @Input() assistantTechs: any[];
    technicians: User[];

    ngAfterViewInit() {
        // Initialize the typeaheads

        // Get the technicians and names
        this._technicianservice.getTechnicians()
            .then(
                technicians => {
                    this.technicians = technicians;
                    let techNames = _.map(technicians, 'name');
                    let techSource = new Bloodhound({
                        datumTokenizer: Bloodhound.tokenizers.whitespace,
                        queryTokenizer: Bloodhound.tokenizers.whitespace,
                        local: techNames
                    });

                    $('#typeaheadAssistantTechs .typeahead').typeahead({
                            hint: true,
                            highlight: true,
                            minLength: 1
                        },
                        {
                            name: 'techSource',
                            source: techSource
                        });

                    // Bind typeahead events
                    $('#typeaheadAssistantTechs .typeahead').bind('typeahead:select', this.typeaheadSelectionMade);
                }
            );
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
        // Set the hidden input to store the value
        $('#assistantSelected').val(technician);

        // Click the button to re-enter Angular scope
        $('#assistantSelectedButton').click();
    }

    // MARK: Hacking Angular 2 to stay within scope
    assistedSelectedButton() {
        let technician = $('#assistantSelected').val();

        // Make sure the technician is not already selected
        let preExistingAssistant = _.find(this.assistantTechs, function(t) {
            return t.name == technician;
        });

        // Assistant already exists, return
        if (!_.isUndefined(preExistingAssistant)) {
            return;
        }

        // Match Typeahead value with object
        let tech: User = _.find(this.technicians, function(t) {
            return t.name == technician;
        });

        // Trim out the unnecessary values
        let techObj = {
            id: tech.id,
            name: tech.name
        };

        // Add the tech to list
        this.assistantTechs.push(techObj);

        // Clear the typeahead input
        $('#typeaheadAssistantTechs .typeahead').typeahead('val', '');
    }

    // MARK: Events on View
    removeTech(tech: User) {
        _.pull(this.assistantTechs, tech);
    }
}
