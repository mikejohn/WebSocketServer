var Chat_Protocol = {
    signIn : 128,
    logOut : 64
};
var Server_ChatProtocolHandler = function () {

};

Server_ChatProtocolHandler = {
    //服务器收到客户端协议内容
    decode : function (client,appData) {
        var opcode_left = appData.readUInt8(0);
        var opcode_right = appData.readUInt8(1);
        if(opcode_left != 0) {
            switch (opcode_left) {
                case Chat_Protocol.signIn:
                    this.playerSignIn(client,appData);
                    break;
                case Chat_Protocol.logOut:
                    this.playerSignIn(client,appData);
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
    playerSignIn : function (client) {
      //广播当前登录客户端

      //向登录用户发送当前所有在线用户

    },
    playerLogOut : function (clientID) {
      //广播当前推出客户端
    }
};

var Client_ChatProtocolHandler = function () {

};
Client_ChatProtocolHandler.prototype = {
    decode : function () {
        var opcode_left = appData.readUInt8(0);
        var opcode_right = appData.readUInt8(1);
        if(opcode_left != 0) {
            switch (opcode_left) {
                case Chat_Protocol.signIn:
                    break;
                case Chat_Protocol.logOut:
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
    playerSignIn : function () {
        var opcode = 1 <<15;
        var data = new Uint16Array(1);
        data[0] = opcode;
        var blob = new Blob([data]);
        return blob;
    },
    playerOnline : function () {

    }
};
