# ChatApp Documentation

### Git Repository
-------------------

The git repository has been split into two sections. The first section is the angular front-end of the chatApp application. All the code relating to the front-end of this application is located in the chatApp folder. The second section is the express back-end of the chatApp application. All the code relating to the back-end of the application is located in the Server folder.

For this project I created a new branch for each major component in the application. After each functional change I made I would create a new commit. This would ensure that if I broke my code or needed to restart I wouldn't lose any work I didn't want to. 

### Data Structures
--------------------

All the data for assignment 1 has been stored in a single JSON file name "data.json". This file contains two arrays, one for groups and one for users. Users contains all the users of the application and the information associated to them. Groups contains all the groups in the application. Each group contains a name, an array of users attached to the group and an array of channels in the group. Each channel will then contain a name and an array of users attached to the channel. 

### Rest API
-------------

As we are only using a single JSON file for this application, my current application only contains one api route that reads the data from the JSON file and writes the data to the JSON file. To retrieve the data you simply send a get request to the "/api" route. To write to the JSON file you simply send a post request containing the data you wish to write to the same route.

This design will be different in the second assignment as the back-end will contain a proper database. More computation will be performed on the back-end which will contain more routes that send specific information rather than all of the information at once. For example it may contain a route which will send back a specific group and all the information associated to that one group. 

However for the first assignment I found it would be easy to just retrieve all the data and perform the computation on the frontend.

### Angular Architecture
------------------------

Currently the angular application contains three main components. The first component is the login component. The login component is the first page a user sees and simply enables the user to log in once the correct username has been entered.

The second component is the dashboard component. This is essentially the user's home page and is the next page they see after they have logged in. the dashboard component contains a number of child components for all the forms that can be viewed by the admin users. I decided to make child components as the admins have a lot of power and can perform a lot of tasks. It was better to seperate the code for all these task rather than store it in the same component. This helps to make it clearer and more readable. 

The last major component is the channel component. Currently the channel component contains nothing in it as it was not required for the first assignment. The angular application also contains a header component. This relates to the header that appears at the top of the browser window on each page. At the moment the header component allows the user to log out. 