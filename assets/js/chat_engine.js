// This is a client-side socket which establishes a socket connection with the server.
// Acts as a subscriber.
console.log("Testing Client :: Chat socket script running!! ");
// const mongoose = require('mongoose');

// const Chat = require('../../models/Chat');
// import Chat from '../../models/Chat';

// Create a connection b/w the user (subscriber) & the server (observer).
// Subscriber always initiates a connection & the observer acknowledges whether or not the connection has been established.

class ChatEngine{
    // userEmail : to know who's exchanging the message
    constructor(chatBoxId, userEmail){
        this.chatBox = $(`#${chatBoxId}`);
        this.userEmail = userEmail;
        // *io* is given to us  by socket.io cdn when it gets loaded
        // io.connect fires the event io.connection to recieve the connection.
        // To use the socket with localhost, change below IP.
        this.socket = io.connect('http://34.207.57.200:5000'); //(*1*) [emits a connection request].
        // if the user-email exist, only then call the connection-handler.
        if(this.userEmail){
            this.connectionHandler();
        }
    }

    // Create a connection-handler which will facilitate the 2-way communication b/w the observer & the subscriber.
    // This has to be called via the constructor as it doesn't get called on it's own.
    connectionHandler(){

        let self = this; //collect the orignal *this* object, as on different events, it'll change. 
        // As Javascript is an event-driven language, hence we use *on* to handle different events here.
        this.socket.on('connect',function(){
            console.log('connection established using sockets! ');
            // Sending data along with *emit*, *join_room* : name of event.
            // When this event will be emitted, it'll be recieved on the chat_sockets{Server-side} 
            self.socket.emit('join_room',{
                user_email : self.userEmail,
                chatRoom : 'Codeial-Room'
            });
            // Further detect back, when the user has joined. 
            self.socket.on('user_joined',function(data){
                console.log("A user joined", data);
            });
        });

        // Client sends a message using "send" button.
        $('#send-message').click(function(){
            let  msg = $('#inp_send_msg').val();
            if(msg!=''){
                let objChat = {objMsg : msg, objEmail : self.userEmail};
                console.log("objchat",objChat);
                self.socket.emit('send_message',{
                    message : msg,
                    user_email : self.userEmail,
                    chatRoom : 'Codeial-Room'
                });
            }
        });

        // Client recieves the broadasted msg from the server.

        self.socket.on('recieve_message',function(data){
            console.log('Message recieved', data.message);
            let newMessage = $('<li>');
            let messageType = 'other-message';
            if(data.user_email == self.userEmail){
                messageType = 'self-message';
            }
            newMessage.append($('<span>',{
                'html' : data.message
            }));
            newMessage.append($('<sub>',{
                'html' : data.user_email
            }));
            newMessage.addClass(messageType);
            $('#chat-messages-list').append(newMessage);
        });
    } //(*3*) [recieves the acknowledgement from (*2*) in chat_sockets.js & confirms the socket-connection-status]
    // Also initialise the class from the view from where it's to be called.
}