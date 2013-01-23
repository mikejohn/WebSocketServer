var undefined = null;
var ClientHandShake = require('./../Objects/ClientHandShake');
var ServerHandShake = require('./../Objects/ServerHandShake');
var Frame = require('./../Objects/Frame');
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
            var p = new Frame();
            p.decode(data);
            console.log(p.PAYLOAD.toString());
            var r = new Frame();
            r.FIN = 1;
            r.RSV1 = 0;
            r.RSV2 = 0;
            r.RSV3 = 0;
            r.OPCODE = Frame.OPCODE_BINARY;
            r.MASK = 0;
            r.PAYLOAD_LEN = 1;
            r.PAYLOAD = new Buffer(1);
            r.PAYLOAD[0] = 65;
            var frame = r.encode();
            socket.write(frame);
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