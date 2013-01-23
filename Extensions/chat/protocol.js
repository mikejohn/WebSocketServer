var Server_ChatProtocolHandler = function () {

};
Server_ChatProtocolHandler = {
    reviceOnline : function (socket) {
        var id = socket.id;
    }
};

var Client_ChatProtocolHandler = function () {

};
Client_ChatProtocolHandler.prototype = {
    decode : function () {

    },
    sendOnline : function () {
        var opcode = 1 <<15;
        var data = new Uint16Array(1);
        data[0] = opcode;
        var blob = new Blob([data]);
        return blob;
    },
    reviceOnline : function () {

    }
};
