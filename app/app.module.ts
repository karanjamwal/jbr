import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { HttpModule } from '@angular/http';

import 'rxjs';
import { ModalModule } from 'angular2-modal';
import { BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';
import { FileUploadModule } from 'ng2-file-upload';

import { routing } from './app.routing';

import { AppRootComponent }   from './app_root.component';
import { AppComponent }   from './app.component';
import { DashboardComponent } from './dashboard.component';
import { CreateTicketComponent } from './create_ticket.component';
import { CreateTicketModalComponent } from './create_ticket_modal.component';
import { TicketScheduleComponent } from './schedule_components/ticket_schedule.component';
import { LogInComponent } from './login.component';
import { CompletedTicketComponent } from './completed_tickets.component';
import { TicketDetailsComponent } from './ticket_details.component';
import { TicketQuoteComponent } from './ticket_quote.component';
import { TicketHistoryComponent } from './ticket_history.component';
import { SelectModule } from 'ng2-select';
import { Navbar } from './navbar.component';
import { UserListingComponent } from './user_listing.component';
import { CreateUserComponent } from './create_user.component';
import { PrimaryTechComponent } from './schedule_components/ticket_assignment_primary_tech.component';
import { AssistantTechsComponent } from './schedule_components/ticket_assignment_assistant_techs.component';
import { UnscheduledTicketsComponent } from './schedule_components/unscheduled_tickets.component';
import { TicketAssignmentComponent } from './schedule_components/ticket_assignment.component';
import { ProtectedDirective } from "./directives/protected.directive";
import { PdfViewerComponent } from './pdf-viewer/index';
import { Ng2ImgFallbackModule } from 'ng2-img-fallback';
import { CookieService } from 'angular2-cookie';

import { TicketService } from './service/ticket.service';
import { ScheduleService } from './service/schedule.service';
import { PayrollService } from './service/payroll.service';
import { SessionService } from './service/session.service';
import { TechniciansService } from './service/technicians.service';
import { CustomersService } from './service/customer.service';
import { AuthenticationService } from './service/authentication.service';
import { UserService } from './service/user.service';
import { DocumentService } from './service/document.service';
import { GuidService } from './service/guid.service';
import { PdfTypeService } from './service/pdfType.service';

import { RegionPipe } from './pipes/region.pipe';
import { PriorityPipe } from "./pipes/priority.pipe";

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        routing,
        ModalModule.forRoot(),
        BootstrapModalModule,
        FileUploadModule,
        SelectModule,
        Ng2ImgFallbackModule,
    ],
    declarations: [
        AppRootComponent,
        AppComponent,
        DashboardComponent,
        CreateTicketComponent,
        CreateTicketModalComponent,
        TicketScheduleComponent,
        LogInComponent,
        CompletedTicketComponent,
        TicketDetailsComponent,
        TicketQuoteComponent,
        TicketHistoryComponent,
        Navbar,
        UserListingComponent,
        CreateUserComponent,
        PrimaryTechComponent,
        AssistantTechsComponent,
        UnscheduledTicketsComponent,
        TicketAssignmentComponent,
        ProtectedDirective,
        RegionPipe,
        PriorityPipe,
        PdfViewerComponent,
    ],
    providers: [
        TicketService,
        ScheduleService,
        PayrollService,
        SessionService,
        TechniciansService,
        CustomersService,
        AuthenticationService,
        UserService,
        DocumentService,
        GuidService,
        PdfTypeService,
        CookieService,
    ],
    bootstrap: [
        AppComponent,
    ],
    entryComponents: [
        CreateTicketModalComponent,
    ],
})

export class AppModule {

}
