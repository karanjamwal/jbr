import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { TicketAssignmentComponent } from './ticket_assignment.component';
import { ScheduleService } from '../service/schedule.service';
import { Schedule } from '../models/schedule';
import { Ticket } from '../models/ticket';
import { User } from '../models/user';
import { DocumentService } from "../service/document.service";
import { SessionService } from "../service/session.service";

declare let DataTable: any;
declare let $: any;
declare let moment: any;
declare let _: any;
declare let ResizeSensor: any;

@Component({
    selector: "ticket-schedule",
    styleUrls: ['lib/ticket_schedule/ticket_schedule.css'],
    templateUrl: 'app/schedule_components/ticket_schedule.component.html',
})

export class TicketScheduleComponent implements OnInit {
    constructor(
        private _router: Router,
        private _scheduleService: ScheduleService,
        private _documentService: DocumentService,
        private _sessionService: SessionService,
    ) { }

    scheduledTickets = [];
    unscheduledTickets = [];
    weekdays: Weekday[] = [];
    ticketAssignmentComp: TicketAssignmentComponent;
    technicianSchedules: TechnicianSchedule[] = [];
    regions = ['Birmingham', 'Nashville', 'Mobile', 'Panama City'];
    regionCurrentIndex = 0;

    firstDayOfMonth = 0; // This is actually the month on the first day of the week
    lastDayOfMonth = 0; // This is actually the month on the last day of the week
    year = 0;
    fetchedMonths = []; // Used to prevent re-fetching data

    dayCountInRow = 7;

    ngOnInit() {
        // Get the users timezone
        let defaultTimeZone = moment.tz.guess();
        // Configure week array (this will be used to help parse the schedule)
        this.weekdays = [];
        for (let i = 1; i <= this.dayCountInRow; i++) {
            let wd: Weekday = {
                date: moment().tz(defaultTimeZone).startOf('isoWeek').day(i),
                status: '',
            };

            this.weekdays.push(wd);
        }

        this.updateWeekdays();

        // Get Year and Month
        this.firstDayOfMonth = this.weekdays[0].date.month() + 1;
        this.lastDayOfMonth = this.weekdays[6].date.month() + 1;
        this.year = this.weekdays[0].date.year();

        // Does the week contain two months
        if (this.firstDayOfMonth != this.lastDayOfMonth) {
            this.loadSchedule(this.year, this.firstDayOfMonth, function() {
                // Check for a new year
                if (this.lastDayOfMonth == 1) {
                    this.loadSchedule(this.year + 1, this.lastDayOfMonth, null);
                } else {
                    this.loadSchedule(this.year, this.lastDayOfMonth, null);
                }
            });
        } else {
            // Fetch Schedule
            this.loadSchedule(this.year, this.firstDayOfMonth, null);
        }

        let unscheduledJobsWrapper = $('.unscheduled-jobs-wrapper');
        new ResizeSensor(unscheduledJobsWrapper, function() {
            $('.whitespace').height(unscheduledJobsWrapper.height());
        });
    }

    // MARK: This is bound to an event emitted from the ticket_assignment_component
    onTicketUpdated(ticket: Ticket, reload = true) {
        // $('#scheduleLoading').show();
        this._documentService.putDocument(JSON.stringify(ticket)).then(
            ticket => {
                if (reload) {
                    // Blank out scheduled
                    this.technicianSchedules = [];

                    // Has ticket been unassigned?
                    // A scheduled ticket must have technicians and startDate/endDate
                    // See if ticket has technicians
                    if (!_.has(ticket, 'technicians') ||
                        ticket.technicians.length === 0 ||
                        !_.has(ticket, 'jobStart') ||
                        !_.has(ticket, 'jobEnd') ) {
                        this.reloadUnscheduledTicket(ticket);
                        return;
                    }

                    // Reload the scheduled tickets
                    this.reloadScheduledTicket(ticket);
                }
            },
            error => {
                console.log("Error Updating Ticket => " + error);
            }
        );
    }

    // MARK: Events on View
    addTicketClick() {
        this._router.navigate(['CreateTicket']);
    }

    updateWeekdays(shiftDays = 0) {
        this.weekdays.forEach((wd) => {
            wd.date.add(shiftDays, 'days');

            let dayDiff = moment().startOf('day').diff(moment(wd.date), 'days');
            if (dayDiff > 0) {
                wd.status = 'previous';
            } else if(dayDiff == 0) {
                wd.status = 'today';
            } else {
                wd.status = 'upcoming';
            }
        });
    }

    goToNextWeek() {
        this.updateWeekdays(7);

        // Get Year and Month
        let newMonth = this.weekdays[this.dayCountInRow - 1].date.month() + 1;
        let newYear = this.weekdays[this.dayCountInRow - 1].date.year();

        // Do we need to fetch new data
        if (this.lastDayOfMonth != newMonth) {
            // Get Year and Month
            this.firstDayOfMonth = this.weekdays[0].date.month() + 1;
            this.lastDayOfMonth = this.weekdays[this.dayCountInRow - 1].date.month() + 1;
            this.year = newYear;
            this.loadSchedule(newYear, newMonth, null);
        } else {
            this.buildSchedule();
        }

        this.buildSchedule();
    }

    goToLastWeek() {
        this.updateWeekdays(-7);

        // Get Year and Month
        let newMonth = this.weekdays[0].date.month() + 1;
        let newYear = this.weekdays[0].date.year();

        // Do we need to fetch new data
        if (this.firstDayOfMonth != newMonth) {
            // Get Year and Month
            this.firstDayOfMonth = this.weekdays[0].date.month() + 1;
            this.lastDayOfMonth = this.weekdays[this.dayCountInRow - 1].date.month() + 1;
            this.year = newYear;
            this.loadSchedule(newYear, newMonth, null);
        } else {
            this.buildSchedule();
        }
    }

    onRegionSelected(region, index) {
        this.regionCurrentIndex = index;
    }

    onScheduleViewUpdated() {
        let self = this;

        $( ".sortable" ).sortable({
            cancel: '',
            update: function(event, ui) {
                let technicianId = $(this).data('technician-id');
                let dayIndex = $(this).data('day-index');

                let positionMap = {};
                $(this).find('div > button').each (function (index) {
                    positionMap[$(this).data('ticket-id')] = index;
                });
                self.technicianSchedules.forEach((ts: TechnicianSchedule) => {
                    if (ts.technician.region == self.regions[self.regionCurrentIndex] &&
                        ts.technician.id == technicianId) {
                        let daySchedule = ts.daySchedules[dayIndex];
                        daySchedule.tickets.forEach((ticket: Ticket) => {
                            if (ticket.priorityMap === undefined) {
                                ticket.priorityMap = {};
                            }
                            ticket.priorityMap[self.weekdays[dayIndex].date.format('YYYY-MM-DD')] = positionMap[ticket.id];
                            self.onTicketUpdated(ticket, false);
                        });
                        return;
                    }
                });
            }
        });
    }

    // MARK: Helpers
    buildSchedule() {
        this.technicianSchedules = [];
        this.scheduledTickets.forEach((_schedule) => {
            let ts: TechnicianSchedule = {
                technician: _schedule.technician,
                daySchedules: [],
            };

            this.weekdays.forEach((wd) => {
                let ds: DaySchedule = {
                    tickets: [],
                };

                _schedule.tickets.forEach((_ticket) => {
                    let range  = moment.range(_ticket.jobStart, _ticket.jobEnd);
                    if (range.contains(wd.date)) {
                        ds.tickets.push(_ticket);
                    }
                });
                ts.daySchedules.push(ds);
            });

            this.technicianSchedules.push(ts);
        });
    }

    loadSchedule(year, month, callback) {
        $('#scheduleLoading').show();

        let monthKey = `${month}-${year}`;

        // See if month was already fetched, if so do nothing
        let monthIndex = _.findIndex(this.fetchedMonths, function (item) {
            return item == monthKey;
        });
        if (monthIndex > -1) {
            this.buildSchedule();
            $('#scheduleLoading').hide();
            return;
        }

        // Fetch Schedule
        this._scheduleService.getSchedule(year, month).then(
            schedule => {
                // Check for empty schedule
                if (_.isEmpty(schedule)) {
                    console.log("There is no schedule.");
                    $('#scheduleLoading').hide();
                    return;
                }
                // Set fetched month key
                this.fetchedMonths.push(monthKey);

                this.concatData(schedule);
                this.unscheduledTickets = schedule.unscheduledTickets;
                this.buildSchedule();
                $('#scheduleLoading').hide();

                // The callback feature is really only used in the rare case that we need to load multiple months at once...which
                // only occurs when the initial week (the current week) starts in a different month than it ends
                if (callback) {
                    callback();
                }
            },
            error => {
                console.log("Error Fetching Tickets => " + error);
                $('#scheduleLoading').hide();
            }
        );
    }

    reloadUnscheduledTicket(ticket: Ticket) {
        // For some reason, unscheduled tickets gets set to an empty object, force it to an empty array
        if (!_.isArray(this.unscheduledTickets)) {
            this.unscheduledTickets = [];
        }

        // Ticket has not been scheduled so add it to the list
        // Does ticket already exist in unscheduled list
        let unTicketIndex = _.findIndex(this.unscheduledTickets, function(tick: Ticket) {
            return ticket.id == tick.id;
        });

        if (unTicketIndex > 0) {
            this.unscheduledTickets[unTicketIndex] = ticket;
        } else {
            this.unscheduledTickets.push(ticket);
        }

        // Remove the ticket from the schedule
        for (let techTickets of this.scheduledTickets) {
            let ticketIndex = _.findIndex(techTickets.tickets, function(tick: Ticket) {
                return ticket.id == tick.id;
            });
            if (ticketIndex >= 0) {
                _.pullAt(techTickets.tickets, ticketIndex);
            }
        }

        // Reload Grid
        this.buildSchedule();
    }

    reloadScheduledTicket(ticket: Ticket) {
        // Update the ticket in the schedule grid
        for (let techTickets of this.scheduledTickets) {
            let technician: User = techTickets.technician;

            // If this ticket belongs to this technician replace or add
            if (_.some(ticket.technicians, function(tech: {technician: User, role: string} ) {
                    return tech.technician.id == technician.id;
                })) {
                let ticketIndex = _.findIndex(techTickets.tickets, function(tick: Ticket) {
                    return ticket.id == tick.id;
                });

                // Add or update the ticket
                if (ticketIndex != -1) {
                    techTickets.tickets.splice(ticketIndex, 1, ticket);
                } else {
                    techTickets.tickets.push(ticket);
                }
            }
        }

        // Check for adding a technician that currently doesn't exist
        for (let tech of ticket.technicians) {
            let techFound = _.some(this.scheduledTickets, function(scheduleItem) {
                return scheduleItem.technician.id == tech.technician.id;
            });

            if (!techFound) {
                let newScheduleItem = {
                    "technician": tech.technician,
                    "tickets": [ ticket ]
                };
                this.scheduledTickets.push(newScheduleItem);
            }
        }

        // Remove the ticket from unscheduled if it does exist
        let unscheduledTicketIndex = _.findIndex(this.unscheduledTickets, function(tick: Ticket) {
            return ticket.id == tick.id;
        });
        if (unscheduledTicketIndex >= 0) {
            _.pullAt(this.unscheduledTickets, unscheduledTicketIndex);
        }

        this.buildSchedule();
    }

    concatData(newScheduledData: Schedule) {
        for (let scheduleObj of newScheduledData.scheduledTickets) {
            // Find the technician
            let techIndex = _.findIndex(this.scheduledTickets, function(item) {
                return scheduleObj.technician.id == item.technician.id;
            });

            if (techIndex == -1) {
                // Technician doesn't exist so add
                this.scheduledTickets.push(scheduleObj);
            } else {
                let existingTickets = this.scheduledTickets[techIndex].tickets;
                this.scheduledTickets[techIndex].tickets = _.concat(existingTickets, scheduleObj.tickets);
            }
        }
    }
}

class TechnicianSchedule {
    technician: User;
    daySchedules: DaySchedule[];
}

class DaySchedule {
    tickets: Ticket[];
}

class Weekday {
    date;
    status: string;
}
