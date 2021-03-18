// This is a client-side socket which establishes a socket connection with the server.
// Acts as a subscriber.

console.log("Testing Client :: Chat socket script running!! ");

// Create a connection b/w the user (subscriber) & the server (observer).
// Subscriber always initiates a connection & the observer acknowledges whether or not the connection has been established.

class ChatEngine{
    // userEmail : to know who's exchanging the message
    constructor(chatBoxId, userEmail){
        this.chatBox = $(`#${chatBoxId}`);
        this.userEmail = userEmail;
        // *io* is given to us  by socket.io cdn when it gets loaded
        // io.connect fires the event io.connection to recieve the connection.
        this.socket = io.connect('http://localhost:5000'); //(*1*) [emits a connection request].
        // if the user-email exist, only then call the connection-handler.
        if(this.userEmail){
            this.connectionHandler();
        }
    }

    // Create a connection-handler which will facilitate the 2-way communication b/w the observer & the subscriber.
    // This has to be called via the constructor as it doesn't get called on it's own.
    connectionHandler(){
        // As Javascript is an event-driven language, hence we use *on* to handle different events here.
        this.socket.on('connect',function(){
            console.log('connection established using sockets! ');
        });
    } //(*3*) [recieves the acknowledgement from (*2*) in chat_sockets.js & confirms the socket-connection-status]
    // Also initialise the class from the view from where it's to be called.
}