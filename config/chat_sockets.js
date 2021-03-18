// This is a server-side socket which establishes a socket connection with the client.
// Acts as an observer.
// Recieve a connection here
module.exports.chatSockets = function(socketServer){
    let io = require('socket.io')(socketServer,{
        cors: {
          origin: '*'
        }});
    // socketServer.listen(5000);
    // whenever a connection is established
    io.sockets.on('connection',function(socket){
        console.log("New connection recieved",socket.id);
    }); //(*2*) [recieves the connection & sends the acknowledgement to (*3*) in client socket that th connection has been established.]
}