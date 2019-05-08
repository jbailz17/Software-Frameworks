import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { environment } from '../../../environments/environment';

@Injectable()
export class DataService {
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http) { }

  // Get user info of all users except for current user
  getUsersInfo(userID) {
    const url = environment.apiUrl + '/users';
    return this.http.get(url, {params: {userID: userID}}).toPromise();
  }

  // Get selected user info.
  getSelectedUser(userID) {
    const url = environment.apiUrl + '/selectedUser';
    return this.http.get(url, {headers: this.headers, params: {ID: userID}}).toPromise();
  }

  // Get info of selected users
  getSelectedUsers(userList) {
    const url = environment.apiUrl + '/selectedUsers';
    return this.http.get(url, {headers: this.headers, params: {userList: userList}}).toPromise();
  }

  // Update user info.
  updateUsers(userInfo) {
    const url = environment.apiUrl + '/users';
    return this.http.put(url, userInfo).toPromise();
  }

  // Create a new user
  createUser(newUser) {
    const url = environment.apiUrl + '/user';
    return this.http.post(url, newUser, {headers: this.headers}).toPromise();
  }

  // Delete a selected user.
  deleteUser(userID) {
    const url = environment.apiUrl + '/user';
    return this.http.delete(url, {headers: this.headers, body: {_id: userID}}).toPromise();
  }

  // Get groups and channels that current user can access.
  getUserGroups(userID) {
    const url = environment.apiUrl + '/groups';
    return this.http.get(url, {params: {userID: userID}}).toPromise();
  }

  // Add a new group.
  addGroup(newGroup) {
    const url = environment.apiUrl + '/group';
    return this.http.post(url, newGroup, {headers: this.headers}).toPromise();
  }

  // Remove selected group
  removeGroup(selectedGroup) {
    const url = environment.apiUrl + '/group';
    console.log('SELECTED GROUP: ', selectedGroup);
    return this.http.delete(url, {headers: this.headers, body: {_id: selectedGroup}}).toPromise();
  }

  // Updated selected groups users
  updateGroupUsers(selectedGroup, userInfo) {
    const url = environment.apiUrl + '/group';
    return this.http.put(url, userInfo, {headers: this.headers, params: {groupID: selectedGroup}}).toPromise();
  }

  // Get selected channel information
  getChannel(selectedGroup, selectedChannel) {
    const url = environment.apiUrl + '/channel';
    return this.http.get(url, {
      headers: this.headers, params: {groupID: selectedGroup, channelName: selectedChannel}
    }).toPromise();
  }

  // Add a new channel
  addChannel(selectedGroup, newChannel) {
    console.log('NEW CHANNEL: ', newChannel);
    const url = environment.apiUrl + '/channel';
    return this.http.post(url, newChannel, {headers: this.headers, params: {groupID: selectedGroup}}).toPromise();
  }

  // Remove selected channel
  removeChannel(selectedGroup, selectedChannel) {
    const url = environment.apiUrl + '/channel';
    return this.http.delete(url, {headers: this.headers, 
      body: {groupID: selectedGroup, channelName: selectedChannel}
    }).toPromise();
  }

  // Update selected channel's users
  updateChannelUsers(selectedGroup, selectedChannel, userInfo) {
    const url = environment.apiUrl + '/channel';
    return this.http.put(url, userInfo, {
      headers: this.headers,
      params: {groupID: selectedGroup, channelName: selectedChannel}
    }).toPromise();
  }

  // Post a new message to the specified channel
  postMessage(groupID, channelName, message) {
    const url = environment.apiUrl + '/message';
    this.http.post(url, message, {headers: this.headers, params: {groupID: groupID, channelName: channelName}}).toPromise();
  }

  // Upload a new profile image for current users. 
  profileImageUpload(data, userID) {
    const url = environment.apiUrl + '/profileImage';
    return this.http.post(url, data, {params: {ID: userID}}).toPromise();
  }

}
