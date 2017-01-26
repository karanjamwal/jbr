import { Pipe } from '@angular/core';
import {Ticket} from "../models/ticket";

@Pipe({
    name: 'PriorityPipe'
})

export class PriorityPipe {
    transform(value, date: string) {
        value.sort((a: Ticket, b: Ticket) => {
            if (b.priorityMap === undefined ||
                b.priorityMap[date] === undefined) {
                return 1;
            } else if (a.priorityMap === undefined ||
                a.priorityMap[date] === undefined ||
                a.priorityMap[date] < b.priorityMap[date]) {
                return -1;
            } else if (a.priorityMap[date] > b.priorityMap[date]) {
                return 1;
            } else {
                return 0;
            }
        });
        return value;
    }
}
