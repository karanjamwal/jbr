import { User } from './user';
import { WorkDay } from './workDay';
import { Customer } from "./customer";

export class Ticket {
    customer: Customer;
    poNumber: string;
    woNumber: string;
    status: string;
    workDescription: string;
    dateOpened: string;
    jobStart: string;
    jobEnd: string;
    technicians: {
        technician: User,
        role: string
    }[];
    priorityMap: any; // priorityMap[date] : number
    technicalNote: string;
    workCompleted: string;

    totalBudget: number;
    materialPrice: number;
    laborCost: number;
    travelCost: number;

    // This is the part/quantity list for the ticket
    materialList: {
        name: string,
        price: number,
        quantity: number
    }[];

    // This is the to-do/checklist for the ticket
    checkList: {
        question: string,
        answer: Boolean
    }[];

    // This is the work days for the ticket
    workDays: WorkDay[];

    pdfUrl: string;
    imageUrls: string[];

    // Stamp
    storeStampImageUrl: string;

    // Signature
    signatureDate: string;
    signatureName: string;
    signatureImageUrl: string;

    // Azure DocumentDB Fields
    docType: string; // This field is for DocumentDB querying on type
    id: string; // Set by Azure DocumentDB

    constructor() {
        this.customer = new Customer();
        this.poNumber = "";
        this.woNumber = "";
        this.status = "";
        this.workDescription = "";
        this.dateOpened = "";
        this.jobStart = "";
        this.jobEnd = "";
        this.technicians = [];
        this.priorityMap = {};
        this.technicalNote = "";
        this.workCompleted = "";

        this.totalBudget = 0;
        this.materialPrice = 0;
        this.laborCost = 0;
        this.travelCost = 0;

        this.materialList = [];
        this.checkList = [];
        this.workDays = [];

        this.pdfUrl = "";
        this.imageUrls = [];

        this.storeStampImageUrl = "";

        this.signatureDate = "";
        this.signatureName = "";
        this.signatureImageUrl = "";

        this.docType = "ticket";
        this.id = "";
    }
}
