import { Pipe } from '@angular/core';

@Pipe({
    name: 'RegionPipe'
})

export class RegionPipe {
    transform(value, region) {
        return value.filter(technicianSchedule => {
            return technicianSchedule.technician.region == region;
        });
    }
}
