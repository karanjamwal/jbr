import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from "@angular/router";

import {DialogRef, ModalComponent} from 'angular2-modal';
import {BSModalContext} from 'angular2-modal/plugins/bootstrap';
import {FileUploader, ParsedResponseHeaders} from 'ng2-file-upload';
import {Config} from './service/config';
import {PdfType} from "./models/pdfType";
import {PdfTypeService} from "./service/pdfType.service";
import {Http} from "@angular/http";

declare let DataTable: any;
declare let $: any;
declare let moment: any;
declare let _: any;

export class CreateTicketModalContext extends BSModalContext {
}

@Component({
    selector: 'modal-content',
    styleUrls: ['lib/create_ticket_modal/create_ticket_modal.css'],
    templateUrl: 'app/create_ticket_modal.component.html',
})

export class CreateTicketModalComponent implements ModalComponent<CreateTicketModalContext>, OnInit {
    context: CreateTicketModalContext;

    public pdfUploader:FileUploader = new FileUploader({
        url: `${Config.node_endpoint}/upload_pdf`,
        authToken: 'Token token=' + Config.auth_token,
    });
    public hasDropZoneOver:boolean = false;

    pdfTypes: PdfType[] = [];
    @ViewChild('pdfTypeSelect') pdfTypeSelect;
    pdfTypeSelectedIndex: number = -1;

    @ViewChild('uploadButton') uploadButton;

    tryCount: number = 0;

    constructor(
        public dialog: DialogRef<CreateTicketModalContext>,
        private _router: Router,
        private _pdfTypeService: PdfTypeService,
        private http: Http,
    ) {
        this.context = dialog.context;
        this.pdfUploader.onAfterAddingFile = (file) => {
            file.withCredentials = false;
            $('.pdf-box').addClass('hidden');
            $('.pdf-image').removeClass('hidden');

            $('.drag-drop').addClass('hidden');
            $('.file-name').removeClass('hidden');
            $('.file-name').text(file._file.name);
        };
    }

    ngOnInit() {
        this._pdfTypeService.getPdfTypes().then(
            pdfTypes => {
                this.pdfTypes = pdfTypes;
                let pdfTypeNames: string[] = [];
                this.pdfTypes.forEach((p:PdfType) => {
                    pdfTypeNames.push(p.name);
                });
                this.pdfTypeSelect.items = pdfTypeNames;
                this.pdfTypeSelect.disabled = false;
                this.pdfTypeSelect.placeholder = 'Select PDF type';
            },
            error => console.log("Error Fetching Tickets => " + error)
        );
    }

    addManualTicketClick() {
        this.dialog.close();
        this._router.navigate(['job/create']);
    }

    public fileZoneOver(e:any):void {
        this.hasDropZoneOver = e;
    }

    public pdfTypeSelected(value:any):void {
        this.pdfTypes.forEach((p: PdfType, index) => {
            if (p.name == value.text) {
                this.pdfTypeSelectedIndex = index;
                return;
            }
        });
    }

    uploadPdf() {
        this.tryCount++;

        let has_error = false;
        if (this.pdfTypeSelectedIndex < 0) {
            has_error = true;
        }

        if (this.pdfUploader.queue.length <= 0) {
            has_error = true;
        }

        if (has_error) {
            return;
        }

        $('#uploadButton').button('loading');

        let uploadFile = this.pdfUploader.queue[this.pdfUploader.queue.length - 1];
        uploadFile.onComplete = (response: string, status: number, headers: ParsedResponseHeaders) => {
            $('#uploadButton').button('processing');
            setTimeout(function () {
                $('#uploadButton').prop('disabled', true);
            }, 0);
            this.harvestPdf(JSON.parse(response).blobUrl, this.pdfTypes[this.pdfTypeSelectedIndex]);
        };
        uploadFile.upload();
    }

    harvestPdf(blobUrl: string, pdfType: PdfType) {
        let url = `${Config.pdf_harvest_endpoint}?path=${encodeURIComponent(blobUrl)}&pdftype=${pdfType.value}`;

        return this.http.get(url)
            .toPromise()
            .then(
                response => {
                    this.dialog.close();
                    $('#uploadButton').button('reset');

                    let res = response.json();
                    this._router.navigate(['job/create', {
                        poNumber: res.PurchaseOrderNumber,
                        woNumber: res.WorkOrderNo,
                        customerName: res.CustomerName,
                        workDescription: res.WorkDescription,
                        jobStart: res.ServiceDate,
                        pdfUrl: blobUrl,
                    }]);
                })
            .catch(this.handleError);
    }

    private handleError(error: any) {
        // In a real world app, we might send the error to remote logging infrastructure
        let errMsg = error.message || 'Server error';
        console.error(errMsg); // log to console instead
        return Promise.reject(errMsg);
    }
}
