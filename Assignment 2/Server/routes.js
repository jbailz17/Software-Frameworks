const fs = require('fs');

module.exports = function(app,path, db, formidable){
    console.log("Routes Started");

    const ObjectId = require('mongodb').ObjectId;

    app.get('/chatApp/*', (req, res) => {
        res.sendFile(path.join(__dirname, '../chatApp/dist') + '/index.html');
    });

    // User routes

    // Retrieve all users except the current user.
    app.get('/api/users', (req, res) => {
        let users = [];
        db.collection('users').find({'_id': {$ne: ObjectId(req.query.userID)}}).toArray((err, result) => {
            if(err) {
                console.log('An error occurred: ' + err, + '\n');
                res.sendStatus(500);
                return;
            }

            result.map((user) => {
                users.push({
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    access: user.access,
                    imagePath: user.imagePath
                });
            });

            res.send(users);
        });
    });

    // Retrieve a list of selected users
    app.get('/api/selectedUsers', (req, res) => {
        console.log('REQUEST: ' + JSON.stringify(req.query.userList) + '\n');
        let users = [];
        for(let userID of req.query.userList) {
            user = ObjectId(userID);
            users.push(user);
        }
        db.collection('users').find({'_id': {$in: users}}).toArray((err, result) => {
            if(err) {
                console.log('An error occurred: ' + err + '\n');
                res.sendStatus(500);
                return;
            }
            users = [];
            console.log('RESULT: ' + result + '\n');
            result.map((user) => {
                users.push({
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    access: user.access,
                    imagePath: user.imagePath
                });
            });
            res.send(users);
        })
    });

    // Retrieve a single selected user
    app.get('/api/selectedUser', (req, res) => {
        db.collection('users').findOne({'_id': ObjectId(req.query.ID)}, (err, result) => {
            if(err) {
                console.log('An error occurred: ' + err + '\n');
                res.sendStatus(500);
                return;
            }
            let user = null;
            user = {
                _id: result._id,
                username: result.username,
                email: result.email,
                access: result.access,
                imagePath: result.imagePath
            };

            res.send(user);
        });
    });

    // Used to log in the current user
    app.get('/api/user', (req, res) => {
       console.log('Username: ', req.query);
       let username = req.query.username;
       let password = req.query.password; 
       db.collection('users').findOne({'username': username}, (err, result) => {
           if(err) {
               console.log('There was an error: ' + err + '\n');
               res.sendStatus(500);
               return;
           }
           if(!result) {
               res.send({error: 'User does not exist'});
               return;
           }

           if(result.password == password) {
               console.log('User: ' + JSON.stringify(result));
               res.send({username: result.username,
                access: result.access,
                email: result.email,
                _id: result._id,
                imagePath: result.imagePath});
               return;
           } else {
               res.send({error: 'Password is incorrect'});
               return;
           }
       });
    });

    // Create a new user.
    app.post('/api/user', (req, res) => {
        console.log('REQUEST: ' + JSON.stringify(req.body) + '\n');

        db.collection('users').insertOne(req.body, (err, result) => {
            if(err) {
                console.log('An error occurred: ' + err + '\n');
                res.sendStatus(500);
                return;
            }
        });

        if(req.body.access == 'super-admin' || req.body.access == 'group-admin') {

            db.collection('users').findOne({'username': req.body.username}).then((user) => {
                db.collection('groups').updateMany({}, {
                    $push: {
                        'users': {'_id': user._id.toString()},
                        'channels.$[elem].users': {'_id': user._id.toString()}
                    }
                }, {
                    arrayFilters: [{"elem._id": {$ne: ""}}], multi: true
                }, (err, result) => {
                    if(err) {
                        console.log('An error occurred: ' + err + '\n');
                        res.sendStatus(500);
                        return;
                    }
                });
            });
        }

        res.sendStatus(200);
    });

    // Update user information for all users
    app.put('/api/users', (req, res) => {
        console.log('REQUEST: ', JSON.stringify(req.body) + '\n');
        for (let user of req.body) {
            db.collection('users').updateOne({'_id': ObjectId(user._id)}, {
                $set: {
                    'access': user.access
                }
            }, (err, result) => {
                if (err) {
                    console.log('An error occurred: ' + err + '\n');
                    res.sendStatus(500);
                    return;
                }
            });

            if(user.access == 'super-admin' || user.access == 'group-admin') {
                db.collection('groups').updateMany({}, {
                    $addToSet: {
                        'users': {'_id': user._id},
                        'channels.$[elem].users': {'_id': user._id}
                    }
                }, {
                    arrayFilters: [{"elem._id": {$ne: ""}}], multi: true 
                },(err, result) => {
                    if(err) {
                        console.log('An error occured: ' + err + '\n');
                        res.sendStatus(500);
                        return;
                    }
                });
            }
        }
        res.sendStatus(200);
    });

    // Delete the selected user.
    app.delete('/api/user', (req, res) => {
        console.log('REQUEST: ' + req.body._id);

        db.collection('groups').updateMany({}, {
            $pull: {
                'users': {'_id': req.body._id},
                'channels.$[elem].users': {'_id': req.body._id}
            }
        }, {
            arrayFilters: [{"elem._id": {$ne: ""}}], multi: true
        }, (err, result) => {
            if(err) {
                console.log('An error occurred: ' + err + '\n');
                res.sendStatus(500);
                return;
            }
        });

        db.collection('users').findOneAndDelete({'_id': ObjectId(req.body._id)}, (err, result) => {
            if(err) {
                console.log('An error occurred: ' + err + '\n');
                res.sendStatus(500);
                return;
            }

            res.send(result);
        });
    });

    // Group routes

    // Retrieve all groups and channels that the current user can access
    app.get('/api/groups', (req, res) => {
        console.log('data: ' + req.query.userID);
        db.collection('groups').find({'users': {'_id': req.query.userID}}).toArray((err, result) => {
            if(err) {
                console.log('An error occurred: ' + err + '\n');
                res.sendStatus(500);
                return;
            }

            result.map((group) => {
                group.channels = group.channels.map((channel) => {
                    for(let user of channel.users) {
                        if (user._id == req.query.userID) {
                            return channel
                        }
                    }
                });
            });

            console.log(JSON.stringify(result) + '\n');
            res.send(JSON.stringify(result));
        });
    });

    // Add a new group
    app.post('/api/group', (req, res) => {
        console.log('REQUEST: ' + JSON.stringify(req.body) + '\n');
        db.collection('groups').insertOne(req.body, (err, result) => {
            if(err) {
                console.log('An error occurred: ' + err + '\n');
                res.sendStatus(500);
                return;
            }

            res.send(result);
        });
    });

    // Update the selected groups users.
    app.put('/api/group', (req, res) => {
        console.log('REQUEST: ' + JSON.stringify(req.body) + '\n');
        db.collection('groups').updateOne({'_id': ObjectId(req.query.groupID)}, {
            $set: {
                'users': req.body
            }
        }, (err, result) => {
            if(err) {
                console.log('An error occurred: ' + err + '\n');
                res.sendStatus(500);
                return;
            }
        });

        db.collection('groups').findOne({'_id': ObjectId(req.query.groupID)}, (err, result) => {
            if(err) {
                console.log('An error occurred: ' + err + '\n');
                res.sendStatus(500);
                return;
            }

            if(result) {
                console.log('RESULT: ' + JSON.stringify(result.users) + '\n');
                db.collection('groups').updateOne({'_id': ObjectId(req.query.groupID)}, {
                    $pull: {
                        'channels.$[elem].users': {$nin: result.users}
                    }
                }, {
                    arrayFilters: [{"elem._id": {$ne: ""}}], multi: true
                }, (err, response) => {
                    if(err) {
                        console.log('An error occurred: ' + err + + '\n');
                        res.sendStatus(500);
                        return;
                    }

                    res.send(response);
                });
            }
        });
    }); 


    // Delete the selected group.
    app.delete('/api/group', (req, res) => {
        console.log('REQUEST: ' + req.body._id);
        db.collection('groups').findOneAndDelete({'_id': ObjectId(req.body._id)}, (err, result) => {
            if(err) {
                console.log('An error occurred: ' + err + '\n');
                res.sendStatus(500);
                return;
            }

            res.send(result);
        });
    });

    // Channel routes

    // Retrieve the selected channel.
    app.get('/api/channel', (req, res) => {
        console.log('REQUEST: ' + JSON.stringify(req.query) + '\n');
        db.collection('groups').aggregate({
            $match: {'_id': ObjectId(req.query.groupID)}
        }, {
            $unwind: '$channels'
        }, {
            $match: {'channels.name': req.query.channelName}
        }, {
            $project: {'name': '$channels.name'}
        }).toArray((err, result) => {
            if(err) {
                console.log('An error occurred: ' + err + '\n');
                res.sendStatus(500);
                return;
            }

            result.map((group) => {
                res.send({
                    channel: group.channels
                });
            });
        });
    });

    // Add a new channel
    app.post('/api/channel', (req, res) => {
        console.log('Request: ' + JSON.stringify(req.body) + '\n');
        console.log('GROUPID: ' + req.query.groupID + '\n');
        db.collection('groups').updateOne({'_id': ObjectId(req.query.groupID)}, {
            $push: {
                'channels': req.body
            }
        }, (err, result) => {
            if (err) {
                console.log('An error occurred: ' + err);
                res.sendStatus(500);
                return;
            }

            res.send(result);
        });
    });

    // Update the selected channels users.
    app.put('/api/channel', (req, res) => {
        console.log('REQUEST: ' + JSON.stringify(req.body) + '\n');
        console.log('PARAMS: ' + JSON.stringify(req.query) + '\n');
        db.collection('groups').updateOne({'_id': ObjectId(req.query.groupID), 'channels.name': req.query.channelName}, {
            $set: {
                'channels.$.users': req.body
            }
        }, (err, result) => {
            if (err) {
                console.log('An error occurred: ' + err);
                res.sendStatus(500);
                return;
            }

            res.send(result);
        });
    });

    // Delete the selected user channel.
    app.delete('/api/channel', (req, res) => {
        console.log('Request: ' + req.body.groupID + " " + req.body.channelName);
        db.collection('groups').updateOne({'_id': ObjectId(req.body.groupID)}, {
            $pull: {
                'channels': {
                    'name': req.body.channelName
                }
            }
        }, (err, result) => {
            if (err) {
                console.log('An error occurred: ' + err + '\n');
                res.sendStatus(500);
                return;
            }

            res.send(result);
        });

    });

    //message routes

    // Add a new message to the channels messages.
    app.post('/api/message', (req, res) => {
        db.collection('groups').updateOne({'_id': ObjectId(req.query.groupID), 'channels.name': req.query.channelName}, {
            $push: {
                'channels.$.messages': req.body
            }
        }, (err, result) => {
            if(err) {
                console.log('An error occurred: ' + err + '\n');
                res.sendStatus(500);
                return;
            }

            res.send(result);
        });
    });

    //image routes

    // Add a new profile image for the selected user.
    app.post('/api/profileImage', (req, res) => {
        console.log('REQUEST: ' + req.body + '\n');
        var form = new formidable.IncomingForm({uploadDir: './profileImages'});
        form.keepExtensions = true;

        form.on('error', function(err) {
            throw err;
            res.send({
                result: "failed",
                data: {},
                numberOfImages: 0,
                message: "Cannot upload images. Error is:" + err
            });
        });
        
        form.on('fileBegin', function(name, file){
            file.path = form.uploadDir + '/' + file.name;
        });

        form.on('file', function(field, file) {
            db.collection('users').updateOne({'_id': ObjectId(req.query.ID)}, {
                $set: {
                    imagePath: file.name
                }
            }, (err, result) => {
                if(err) {
                    console.log('An error occurred: ', err);
                    res.sendStatus(500);
                    return;
                }
            })
            res.send({
                result: 'OK',
                data:{'filename': file.name, 'size': file.size},
                numberOfImages: 1,
                message: "upload successful"
            });
        });

        form.parse(req);

    });
};