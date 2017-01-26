export class Region {
    name: string;

    // Azure DocumentDB Fields
	docType: string; // This field is for DocumentDB querying on type
	id: string; // Set by Azure DocumentDB
    
    constructor() {
        this.name = "";
        this.docType = "user";
        this.id = "";
    }
}
