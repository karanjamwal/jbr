import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { CreateTicketComponent } from './create_ticket.component';
import { TicketScheduleComponent } from './schedule_components/ticket_schedule.component';
import { CompletedTicketComponent } from './completed_tickets.component';
import { LogInComponent } from './login.component';
import { TicketDetailsComponent } from './ticket_details.component';
import { TicketQuoteComponent } from "./ticket_quote.component";
import { TicketHistoryComponent } from './ticket_history.component';
import { UserListingComponent } from './user_listing.component';
import { CreateUserComponent } from './create_user.component';

const appRoutes: Routes = [
    {
        path: 'dashboard',
        component: DashboardComponent
    },
    {
        path: 'job/create',
        component: CreateTicketComponent
    },
    {
        path: 'job/schedule',
        component: TicketScheduleComponent
    },
    {
        path: 'job/complete',
        component: CompletedTicketComponent
    },
    {
        path: 'login',
        component: LogInComponent
    },
    {
        path: 'job/:id',
        component: TicketDetailsComponent
    },
    {
        path: 'job/:id/quote',
        component: TicketQuoteComponent
    },
    {
        path: 'job/history',
        component: TicketHistoryComponent
    },
    {
        path: 'users',
        component: UserListingComponent
    },
    {
        path: 'users/create',
        component: CreateUserComponent
    }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
