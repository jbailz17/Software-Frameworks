import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import * as io from 'socket.io-client';

@Injectable()
export class SocketService {
  private url = 'http://localhost:3000';
  private socket;
  constructor() { }

  // Connect to socket
  connect() {
    this.socket = io.connect(this.url);
  }

  // Join specific channel
  join(data) {
    console.log('JOIN DATA: ', data);
    this.socket.emit('join', data);
  }

  // Send message if user joins channel
  userJoined() {
    let objoinMessage = new Observable(observer=> {
      this.socket.on('joined channel', (data)=>{
        observer.next(data);
      });
      
      return () => {
        this.socket.disconnect();
      }
    });

    return objoinMessage;
  }

  // Leave specific channel
  leave(data) {
    this.socket.emit('leave', data);
  }

  // Send message if user leaves group
  userLeft() {
    let obleftMessage = new Observable(observer=> {
      this.socket.on('left channel', (data)=>{
        observer.next(data);
      });
      
      return () => {
        this.socket.disconnect();
      }
    });

    return obleftMessage;
  }

  // Send message to everyone on channel.
  sendMessage(data){
    this.socket.emit('add-message', data);
  }

  // Get messages sent to channel.
  getMessage(){
    let obmessages = new Observable(observer => {

      this.socket.on('message',(data)=>{
        observer.next(data);
      });

      return () => {
        this.socket.disconnect();
      }
    });

    return obmessages;
  }
}
