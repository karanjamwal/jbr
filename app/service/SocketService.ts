import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import * as io from "socket.io-client";
import { Config } from './config';

export interface ISocketItem {
    action : string;
    item : any;
}

@Injectable()
export class SocketService {
    private name: string;
    private host: string = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port;
    socket: SocketIOClient.Socket;

    constructor() {}

    // Get items observable
    get(name: string){ //: Observable<any> 
        this.name = name;
        debugger;
        let socketUrl = this.host + "/" + this.name;
        this.socket = io.connect('http://localhost:8585', {path: '/api/socket.io'});
        this.socket.on("connection", () => this.connect());
        // this.socket.on("disconnect", () => this.disconnect());
        // this.socket.on("error", (error: string) => {
        //     console.log(`ERROR: "${error}" (${socketUrl})`);
        // });

        // Return observable which follows "create" and "remove" signals from socket stream
        // return Observable.create((observer: any) => {
        //     this.socket.on("create", (item: any) => observer.next({ action: "create", item: item }) );
        //     this.socket.on("remove", (item: any) => observer.next({ action: "remove", item: item }) );
        //     return () => this.socket.close();
        // });
    }

    // Create signal
    create(name: string) {
        this.socket.emit("create", name);
    }

    // Remove signal
    remove(name: string) {
        this.socket.emit("remove", name);
    }

    // Handle connection opening
    private connect() {
        console.log("Connected");

        this.socket.emit('authorize', {token: Config.auth_token});
        this.socket.on('authorized',  this.onAuthorize);

        this.socket.on("ticket-suspended", this.onTicketSuspended.bind(this)); 
        // Request initial list when connected
        //this.socket.emit("list");
    }

    private onTicketSuspended(data: any){ 
        console.log("Where am I reached : " + data);
    }

    private onAuthorize(data: any){ 
        console.log("Autho");
    }

    // Handle connection closing
    private disconnect() {
        console.log(`Disconnected from "${this.name}"`);
    }
}