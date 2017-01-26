import { Region } from './region';

export class User {
    name: string;
    email: string;
    password: string;
    role: string;
    region: string;

    // Azure DocumentDB Fields
    docType: string; // This field is for DocumentDB querying on type
    id: string; // Set by Azure DocumentDB

    constructor() {
        this.name = "";
        this.email = "";
        this.password = "";
        this.role = "";
        this.region = "";

        this.docType = "user";
        this.id = "";
    }
}
