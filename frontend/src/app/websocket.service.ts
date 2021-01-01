import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

	socket;

 	constructor() {
		this.socket = io('http://localhost:3037');
	}
	
	listen(eventname : string) : Observable<any> {
		return new Observable((subscribe) => {
			this.socket.on(eventname, (data) => {
        subscribe.next(data);
			});
		});
	}

	emit(eventname: string, data: any) {
		this.socket.emit(eventname, data);
	}
}
