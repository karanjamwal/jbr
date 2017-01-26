import { Ticket } from "./ticket";
import { User } from "./user";

export class Schedule {
    scheduledTickets:
    {
        technician: User;
        tickets: Ticket[];
    }[];
    unscheduledTickets: Ticket[];
    
    constructor() {
        this.scheduledTickets = [];
        this.unscheduledTickets = [];
    }
}