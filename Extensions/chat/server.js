var Logger = require('./Logger');
var Log = new Logger('./log.txt');
var Frame = require('./../../Objects/Frame');
var Chat_Protocol = {
    signIn : 128,
    logOut : 64
};
var ChatServer = function () {
    this.clients = [];
    this.onlineClientNum = 0;
    this.client_id = 1;
};
ChatServer.prototype = {
    listen : function (socket,appData) {
        var client = null;
        if(socket.client_id === undefined) {
            this.client_id++;
            socket.client_id = this.client_id;
            client = new ChatServer.Client(this.client_id,socket);
            this.clients.push(client);
            this.onlineClientNum++;
        } else {
            client = this.clients[socket.client_id];
        }
        console.dir(appData);
        var opcode_left = appData.readUInt8(1);
        var opcode_right = appData.readUInt8(0);
        if(opcode_left != 0) {
            switch (opcode_left) {
                case Chat_Protocol.signIn:
                    this.clientSignIn(client,appData);
                    break;
                case Chat_Protocol.logOut:
                    this.clientLogOut(client,appData);
                    break;
                default :
                    Log.error('undefined opcode_left');
            }
        }
        if(opcode_right !=0) {
            switch (opcode_right) {
                case 1:
                    break;
                default :
                    Log.error('undefined opcode_right');
            }
        }
    },
    clientSignIn : function (client) {

        //广播当前登录客户端
        var signIn_info = ChatServer.MessageFormat.Single_Unmask();
        signIn_info.PAYLOAD = new Buffer(6);
        signIn_info.PAYLOAD[0] = 128;
        signIn_info.PAYLOAD[1] = 0;
        signIn_info.PAYLOAD[2] = 0;
        signIn_info.PAYLOAD[3] = 1;
        signIn_info.PAYLOAD.writeUInt16BE(client.id,4);
        signIn_info.PAYLOAD_LEN = 6;
        var reply = signIn_info.encode();
        //向登录用户发送当前所有在线用户
        var poz = 4;
        var online_client_info = ChatServer.MessageFormat.Single_Unmask();
        online_client_info.PAYLOAD_LEN = this.onlineClientNum*2+4;
        online_client_info.PAYLOAD = new Buffer(this.onlineClientNum*2+4);
        online_client_info.PAYLOAD[0] = 128;
        online_client_info.PAYLOAD[1] = 0;
        online_client_info.PAYLOAD.writeUInt16BE(this.onlineClientNum-1,2);

        var clients = this.clients,c = null;
        for(var i=0;i<clients.length;i++) {
            c = clients[i];
            if(c.status === ChatServer.Online) {
                c.socket.write(reply);
                online_client_info.PAYLOAD.writeUInt16BE(c.id,poz);
                poz+=2;
            }
        }
        reply = online_client_info.encode();
        client.socket.write(reply);
    },
    clientLogOut : function (clientID) {
        //广播当前推出客户端
    }
};
ChatServer.MessageFormat = {
    Single_Unmask : function () {
        var frame = new Frame();
        frame.FIN = 1;
        frame.RSV1 = 0;
        frame.RSV2 = 0;
        frame.RSV3 = 0;
        frame.OPCODE = Frame.OPCODE_BINARY;
        frame.MASK = 0;
        return frame;
    }
};
ChatServer.Client = function (id,socket) {
    this.id = id;
    this.socket = socket;
    this.status = ChatServer.Client.HandShake;
};
ChatServer.Client.prototype = {

};

ChatServer.Client.HandShake = 0;
ChatServer.Client.SignIn = 1;
ChatServer.Client.Online = 2;
ChatServer.Client.LogOut = 3;
module.exports = ChatServer;