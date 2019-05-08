import { Component, OnInit, OnDestroy} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SocketService } from '../services/socket-service/socket.service';
import { DataService } from '../services/data-service/data.service';
import { ChannelModel } from '../models/channel.model';
import { UserModel, UserIDModel } from '../models/user.model';
import { MessageModel } from '../models/message.model';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.css']
})
export class ChannelComponent implements OnInit {

  message: MessageModel;
  messages: any[] = [];
  getMessage;
  userJoined;
  userLeft;

  channel: ChannelModel = null;
  users: UserModel[] = [];

  constructor(private socketService: SocketService,
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {

    // If not logged in return to login page
    if(!sessionStorage.getItem('username')) {
      console.log('Invalid user!');
      sessionStorage.clear();
      alert("Invalid User");
      this.router.navigate(['/login']);
      return;
    }

    // Connect to socket
    this.socketService.connect();

    // Subscribe to user join messages.
    console.log("Session started for: " + sessionStorage.getItem('username'));
    this.userJoined = this.socketService.userJoined().subscribe((message) => {
      console.log(message);
      this.messages.push(message);
    });

    // Subscribe to user left messages.
    this.userLeft = this.socketService.userLeft().subscribe((message) => {
      console.log(message);
      this.messages.push(message);
    });

    // Subscribe to channel messages.
    this.getMessage = this.socketService.getMessage().subscribe((message: any)=>{
     this.findUser(message.user).then((res) => {
       message.user = new UserModel() 
       message.user.username = res.username;
       message.user.imagePath = res.imagePath;
     });
      this.messages.push(message);
      console.log('MESSAGES: ', this.messages);
    });

    // Get channel info
    this.getChannel();
    this.message = new MessageModel();
    this.message.user = sessionStorage.getItem('_id');
    this.message.content = '';
  }

  // Create a user list to send to API.
  createUserList(users) {
    let userList = [];
    for (let user of users) {
      userList.push(user._id);
    }
    return userList;
  }

  // Get current channel information.
  getChannel() {
    let groupID = this.route.snapshot.paramMap.get('id');
    let channelName = this.route.snapshot.paramMap.get('name');

    this.dataService.getChannel(groupID, channelName).then((res) => {
      if(res) {
        console.log(res.json());
        this.channel = res.json().channel;
        this.getChannelUsers(this.channel.users);
        this.loadMessageHistory(res.json().channel.messages);
        this.socketService.join({user: sessionStorage.getItem('username'), channel: this.channel.name});
      }
    });

  }

  // Get info of channel users.
  getChannelUsers(userList) {
    this.dataService.getSelectedUsers(this.createUserList(userList)).then((res) => {
      if(res) {
        console.log(res.json());
        this.users = res.json();
        console.log('USERS: ', this.users);
      }
    })
  }

  // Load the channel's message history.
  loadMessageHistory(messages) {
    for (let message of messages) {
      console.log('MESSAGE USER: ', message.user);
      this.findUser(message.user).then((res) => {
        message.user = new UserModel() 
        message.user.username = res.username;
        message.user.imagePath = res.imagePath;
      });
      console.log('MESSAGE USER: ', message);
      this.messages.push(message);
    }
  }

 // Find specific user information. 
 async findUser(userID) {
    let user = await this.dataService.getSelectedUser(userID).then((res) => {
      if(res) {
        return res.json();
      }
    });
    console.log('USER: ', user);
    return user;
  }

  // Send a message to the channel and store it in the database.
  sendMessage(){
    let groupID = this.route.snapshot.paramMap.get('id');
    this.dataService.postMessage(groupID, this.channel.name, this.message);
    this.socketService.sendMessage({channel: this.channel.name, message: this.message});
    this.message.content = '';
  }

  // Unsubscribe from observable and leave channel when component is destroyed.
  ngOnDestroy() {
    this.socketService.leave({user: sessionStorage.getItem('username'), channel: this.channel.name});

    if(this.getMessage) {
      this.getMessage.unsubscribe();
    }

    if(this.userJoined) {
      this.userJoined.unsubscribe();
    }

    if(this.userLeft) {
      this.userLeft.unsubscribe();
    }
  }

}
