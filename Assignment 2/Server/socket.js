module.exports = function(app, io){
    console.log('Server Socket Initialized');

    // User connect
    io.on('connection', (socket) => {
        console.log('user connected');

        // User join specific channel
        socket.on('join', (data) => {
            socket.join(data.channel);
            console.log(data.user + ' joined: ' + data.channel + '\n');
            socket.broadcast.to(data.channel).emit('joined channel', {user: '', content: data.user + ' is online.'});
        });

        // User leave specific channel
        socket.on('leave', (data) => {
            console.log(data.user + ' left: ' + data.channel + '\n');
            socket.broadcast.to(data.channel).emit('left channel', {user: '', content: data.user + ' went offline.'});
            socket.leave(data.channel);
        });

        // Send message to everyone in specific channel
        socket.on('add-message', (data) => {
            io.in(data.channel).emit('message', data.message);
        });

        // User disconnect
        socket.on('disconnect', function(){
            console.log('user disconnected');
        });
    });
}