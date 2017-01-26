import { Injectable } from '@angular/core';
import { Headers, RequestOptions, Http, Response } from '@angular/http';
import { Ticket } from '../models/ticket';
import { Config } from './config';
import { DocumentService } from './document.service';

declare let _: any;

@Injectable()
export class TicketService {
    constructor (private http: Http,
                 private _documentService: DocumentService) {}

    _ticketEndpoint = Config.node_endpoint + "/ticket";
    // _activeTicketEndpoint = Config.node_endpoint + "/ticket/active";
    _completedTicketEndpoint = Config.node_endpoint + "/ticket/complete";
    _ticketHistoryEndpoint = Config.node_endpoint + "/ticket/history";
    _closedTicketKPIEndpoint = Config.node_endpoint + "/ticket/closedTicketsKPIs";
    _authorizationToken = Config.auth_token;

    getTickets (): Promise<Ticket[]> {
        return new Promise((resolve, reject) => {
            // Query for Open Tickets
            let queryParams = {
                "parameters": [
                    { property: "docType", value: "ticket" },
                ]};

            this._documentService.queryDocuments(queryParams).then(tickets => {
                // Check for empty data sets
                if (!_.isEmpty(tickets)) {
                    resolve(tickets);
                } else {
                    resolve([]);
                }
            });
        });
    }

    getActiveTickets (): Promise<Ticket[]> {
        return new Promise((resolve, reject) => {
            // Query for Open Tickets
            let queryParams = {
                "parameters": [
                    { property: "docType", value: "ticket" },
                    { property: "status", value: "Open" }
                ]};

            this._documentService.queryDocuments(queryParams).then(openJobs => {
                // Query for In Progress Tickets
                queryParams.parameters[1].value = "In Progress";
                this._documentService.queryDocuments(queryParams).then(inProgressJobs => {
                    // Check for empty data sets
                    if (!_.isEmpty(openJobs) && !_.isEmpty(inProgressJobs)) {
                        let activeTickets = _.concat(openJobs, inProgressJobs);
                        resolve(activeTickets);
                    } else if (!_.isEmpty(openJobs)) {
                        resolve(openJobs);
                    } else if (!_.isEmpty(inProgressJobs)) {
                        resolve(inProgressJobs);
                    } else {
                        resolve([]);
                    }
                });
            });
        });
    }

    getCompletedTickets(): Promise<Ticket[]> {
        // let headers = new Headers({
        //     'Content-Type': 'application/json',
        //     'Authorization': 'Token token=' + this._authorizationToken
        // });
        // let options = new RequestOptions({ headers: headers });
        // return this.http.get(this._completedTicketEndpoint, options)
        //     .toPromise()
        //     .then(this.extractData)
        //     .catch(this.handleError);
        return new Promise((resolve, reject) => {
            resolve(new Array<Ticket>());
        });
    }

    getTicketHistory(): Promise<Ticket[]> {
        // let headers = new Headers({
        //     'Content-Type': 'application/json',
        //     'Authorization': 'Token token=' + this._authorizationToken
        // });
        // let options = new RequestOptions({ headers: headers });
        // return this.http.get(this._ticketHistoryEndpoint, options)
        //     .toPromise()
        //     .then(this.extractData)
        //     .catch(this.handleError);
        return new Promise((resolve, reject) => {
            resolve(new Array<Ticket>());
        });
    }

    getDashboardTicketKPIs(): Promise<any> {
        // let headers = new Headers({
        //     'Content-Type': 'application/json',
        //      'Authorization': 'Token token=' + this._authorizationToken
        // });
        // let options = new RequestOptions({ headers: headers, body: '' });
        // let requestUrl = `${this._ticketEndpoint}/dashboardKPIS`;
        // return this.http.get(requestUrl, options)
        //     .toPromise()
        //     .then(this.extractData)
        //     .catch(this.handleError);
        return new Promise((resolve, reject) => {
            resolve({});
        });
    }

    // addTicket (ticket: Ticket): Promise<Ticket> {
    //     let body = JSON.stringify(ticket);
    //     let headers = new Headers({
    //         'Content-Type': 'application/json',
    //          'Authorization': 'Token token=' + this._authorizationToken
    //     });
    //     let options = new RequestOptions({ headers: headers });
    //     return this.http.post(this._ticketEndpoint, body, options)
    //         .toPromise()
    //         .then(this.extractPostPutData)
    //         .catch(this.handleError);
    // }

    // updateTicket (ticket: Ticket): Promise<Ticket> {
    //     let body = JSON.stringify(ticket);
    //     let headers = new Headers({
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Token token=' + this._authorizationToken
    //     });
    //     let options = new RequestOptions({ headers: headers });
    //     return this.http.put(this._ticketEndpoint, body, options)
    //         .toPromise()
    //         .then(this.extractPostPutData)
    //         .catch(this.handleError);
    // }

    private extractPostPutData(res: Response) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        let body = res.json();
        return body.data || { };
    }

    private extractData(res: Response) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        let body = res.json();
        return body || {};
    }

    private handleError(error: any) {
        // In a real world app, we might send the error to remote logging infrastructure
        let errMsg = error.message || 'Server error';
        console.error(errMsg); // log to console instead
        return Promise.reject(errMsg);
    }
}
