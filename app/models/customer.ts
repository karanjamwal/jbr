export class Customer {
    id: string;
    docType: string;

    customerListId: string;
    customerName: string;
    phone: string;
    email: string;

    billingAddressLine1: string;
    billingAddressLine2: string;
    billingAddressLine3: string;
    billingCity: string;
    billingState: string;
    billingPostalCode: string;
    shippingAddressLine1: string;
    shippingAddressLine2: string;
    shippingAddressLine3: string;
    shippingCity: string;
    shippingState: string;
    shippingPostalCode: string;

    constructor() {
        this.id = "";
        this.docType = "customer";

        this.customerListId = "";
        this.customerName = "";
        this.phone = "";
        this.email = "";

        this.billingAddressLine1 = "";
        this.billingAddressLine2 = "";
        this.billingAddressLine3 = "";
        this.billingCity = "";
        this.billingState = "";
        this.billingPostalCode = "";
        this.shippingAddressLine1 = "";
        this.shippingAddressLine2 = "";
        this.shippingAddressLine3 = "";
        this.shippingCity = "";
        this.shippingState = "";
        this.shippingPostalCode = "";
    }
}
