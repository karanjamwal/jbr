export class Material {
    name: string;
    price: number;

    // Azure DocumentDB Fields
    docType: string; // This field is for DocumentDB querying on type
    id: string; // Set by Azure DocumentDB

    constructor() {
        this.name = "";
        this.price = 0;

        this.docType = "material";
        this.id = "";
    }
}
