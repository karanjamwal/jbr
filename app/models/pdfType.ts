export class PdfType {
    name: string;
    value: number;

    // Azure DocumentDB Fields
    docType: string; // This field is for DocumentDB querying on type
    id: string; // Set by Azure DocumentDB

    constructor() {
        this.name = "";
        this.value = 0;
        this.docType = "pdfType";
        this.id = "";
    }
}
