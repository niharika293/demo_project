// This is a server-side socket which establishes a socket connection with the client.
// Acts as an observer.
// Recieve a connection here
const Chat = require('../models/Chat');
module.exports.chatSockets = function(socketServer){
    let io = require('socket.io')(socketServer,{
        cors: {
          origin: '*'
        }}); //removes the cors error from console.
    // socketServer.listen(5000);
    // whenever a connection is established
    io.sockets.on('connection',function(socket){
        console.log("New connection recieved",socket.id);
        
        // Whenever a client disconnects, an automatic disconnect event is fired.
        socket.on('disconnect',function(){
            console.log("Socket disconnected!");
        });
        socket.on('join_room',function(data){
            console.log("Joining request recieved!!",data);
            // When the joining request has been recieved, I want the socket to be joined to that particular room.
            // If the chat-room exists, it'll make the user to join that chat-room, else creates a new one.
            socket.join(data.chatRoom);
            // To let others in the chat-room know that another user has joined.
            // To emit in a specific chat-room.
            io.in(data.chatRoom).emit('user_joined',data);
        });

        // Server recieves & broadcasts to the other subscribers.

        socket.on('send_message',function(data){
            io.in(data.chatRoom).emit('recieve_message',data);
        });
    
    }); //(*2*) [recieves the connection & sends the acknowledgement to (*3*) in client socket that th connection has been established.]
}