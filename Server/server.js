var undefined = null;
var ClientHandShake = require('./../Objects/ClientHandShake');
var ServerHandShake = require('./../Objects/ServerHandShake');
var Frame = require('./../Objects/Frame');
var ChatServer = require('./../Extensions/chat/server.js');
var cs = new ChatServer();
var server = require('net').createServer();
var port = 4001;
server.on('listening', function() {
    console.log('Server is listening on port', port);
});
var i = 0;
server.on('connection', function(socket) {
    socket.i = i++;
    console.log('Server has a new connection');
    socket.on('data',function handshake(data){
        console.log(data.toString());
        var data = data.toString();
        var clientHS = new ClientHandShake(data);
        var serverHS = new ServerHandShake();
        serverHS.generate(clientHS);
        console.log(serverHS.encode());
        socket.write(serverHS.encode());
        socket.removeListener('data',handshake);
        socket.on('data',function recive(data){
            var f = new Frame();
            f.decode(data);
            cs.listen(socket,f.PAYLOAD);
        });
        //console.log(serverHS.toString());
    });
});
server.on('close', function() {
    console.log('Server is now closed');
});
server.on('error', function(err) {
    console.log('Error occurred:', err.message);
});
server.listen(port);