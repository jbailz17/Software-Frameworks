# ChatApp Documentation

### Git Repository
-------------------

The git repository has been split into two sections. The first section is the angular front-end of the chatApp application. All the code relating to the front-end of this application is located in the chatApp folder. The second section is the express back-end of the chatApp application. All the code relating to the back-end of the application is located in the Server folder.

For this project I created a new branch for each major component in the application. After each functional change I made I would create a new commit. This would ensure that if I broke my code or needed to restart I wouldn't lose any work I didn't want to. 

### Data Structures
--------------------

All the data for assignment 2 has been stored in a mongo database. They are seperated into two collections, groups and users. Users contains a unique id, username, email, password, access and imagePath. Groups contains an array of user id's, a name and an array of channels. The array of channels contains an array of user id's, a name and an array of messages. The array of messages contains the user who wrote the message and the content of the message.

These data representations can be found in the models folder in the Angular source code. You can also run a query on the mongo database to see how the data is stored.

### Rest API
-------------

The angular frontend communicates with the node express back end using the five main groups of routes described below.

#### User Routes
[GET] - The user routes have a number of get routes as we needed to retrieve user information in a number of different ways. The first route is "/api/users". This route takes in the current user's id. This is used to retrieve the information of all the users except the one currently logged in. This information is used by admin uses to modify user settings. The second route is "/api/selectedUsers". This route takes in an array of selected user's id's. This route is used to return a number of selected users. This information is used in the channel component to display the information of the channel's users. The third route is '/api/selectedUser'. This route takes in one user id. This route is used to retrieved the information of one selected user. This information is used to display the user information along with the messages in the specific channel. Finally we have the "/api/user" route which is used by the AuthService to authenticate the user and log the user into the chatApp. The route takes in the username and password entered by the user on the log in page. 

[POST] - The post route, "/api/user" is used to add a new user to the user collection. This route takes in the new user data and adds it to the user collection in our mongo database.

[PUT] - The put route, "/api/users" takes in an array of users and updates them accordingly so that the information in the mongo database equals the information entered on the angular app.

[DELETE] - The delete route, "/api/user", takes in a single user ID and removes the corresponding user from the users collection and removes it from where ever it occurs in the groups collection. 

#### Group Routes

[GET] - The get route, "/api/groups", takes in a user ID and returns the groups and channels that contain that user ID. This information is then displayed to the user on the dashboard component where they can select to join the channels that they have access to.

[POST] - The post route, "/api/group", takes in data for a new group and then adds the group to the groups collection in our mongo database.

[PUT] - The put route, "api/group", takes in a group ID and the updated user data to update the selected group. The group ID is used to find the group to update and then the updated user data is stored in the correct groups user array in our mongo database. 

[DELETE] - The delete route, "/api/group", takes in a group ID to find the group and remove it from our mongo database. 

#### Channel Routes

[GET] - The get route, "/api/channel", takes in a group ID and the channel Name to find the channel and then send the channel's data to the angular application. 

[POST] -The post route, "/api/channel", takes in a group ID and the new channel data to find the selected group and add the new channel data to the group's channels array.

[PUT] - The put route, "/api/channel", takes in a group ID, channel name and updated user data to find the selected channel and update the channel's users array accordingly.

[DELETE] - The delete route, "/api/channel", takes in a groupID and the channel name to find the selected channel and remove it from the group's channels array. 

#### Message Routes

[POST] - The post route, "/api/message", takes in the group ID, channel name and message to find the correct channel and then add the message to the selected channel's messages array.

#### Image Routes

[POST] - The post route, "/api/profileImage", takes in the uploaded image and the current user ID. The image is stored in the profileImages folder and the new image path is stored as the current User's imagePath value in our mongo database. 


### Angular Architecture
------------------------

#### Components

This angular app is seperated into three main components. The first component is our login component. The login component is the first page the user sees and ask the user to enter a username and password. If the user enters the correct username and password they are then taken to our second main component which is our dashboard component. 

The dashboard component contains all the information the user needs to see. This includes the user's information and the groups and channels the user has access to. If the user has admin access they can also modify the data on the dashboard component. The dashboard component also icluded a child component called user table. The user table is used by the admins to add, modify and delete users. The user-table component can only be accessed by users with admins access.

If a user clicks on a specific channel on the dashboard they are then taken to our final component, the channel component. The channel component displays all the messages in the channel as well as the information of the users who are in the channel. The channel component also allows users to communicate with one another in real time.

The angular app also contains a header component. The header component is always displayed and allows the user to logout when ever they want.

#### Services

This angular app contains three services. The first service is our AuthService. The AuthService is used to log a user into the application as well as communicate with the components to advise whether a user is logged in or not. The second service is our socket service. The socket service is only used by our channel component. It allows a user to join a channel and communicate with the other users of the channel in real time. It accomplishes this by calling on and sending data to the socket functions on the backend. Our final service is the data service. The data service is used to communicate with the backend api to send data to the database and to retrieve data from the database. This is accomplished by making different request to the backend api routes described above.

#### Models

The angular application contains models for all the data stored in our mongo database. The app has a channel model, group model, message model and user model. These models allow us to prepare the data in the proper structure before sending it to the backend. They also ensure that we are dealing with the same data structures throughout our whole application.
