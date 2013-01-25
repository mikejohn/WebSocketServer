Uint8Array.prototype.readUInt16BE = function (offset) {
    var B = this[offset];
    var L = this[offset+1];
    return (B << 8)+L;
};
Uint8Array.prototype.readUInt16LE = function (offset) {
    var B = this[offset+1];
    var L = this[offset];
    return (B << 8)+L;
};
Uint8Array.prototype.readUInt8 = function (offset) {
    return this[offset];
};
var Chat_Protocol = {
    signIn : 128,
    logOut : 64
};
var ChatClient = function () {
    this.ws;
    this.DOMS = [];
};
ChatClient.prototype = {
    connect : function () {
        var that = this;
        try {
            this.ws = new WebSocket('ws://192.168.0.4:4001');
        } catch (ex) {
            console.dir(ex);
            return;
        }
        this.ws.onopen = function () {
            console.log('Connection success!');
            that.clientSignIn();
        };
        this.ws.onmessage = function (socket) {
            var reader = new FileReader();
            reader.onloadend = function(){
                var appData = new Uint8Array(reader.result);
                var opcode_left = appData.readUInt8(0);
                var opcode_right = appData.readUInt8(1);
                if(opcode_left != 0) {
                    switch (opcode_left) {
                        case Chat_Protocol.signIn:
                            that.onlineInfo(appData);
                            break;
                        case Chat_Protocol.logOut:
                            that.offlineInfo(appData);
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
            };
            reader.readAsArrayBuffer(socket.data);
        };
        this.ws.onclose = function (close) {
            console.dir(close);
            console.log("Connection close");
        };
        this.ws.onerror = function (error) {
            console.dir(error);
        };
    },
    clientSignIn : function () {
        var opcode = 1 <<15;
        var data = new Uint16Array(1);
        data[0] = opcode;
        var blob = new Blob([data]);
        this.ws.send(blob);
    },
    onlineInfo : function (appData) {
        var clientNum = appData.readUInt16BE(2);
        var client_id = 0;
        for(var i=0;i<clientNum;i++){
            client_id = appData.readUInt16BE(4+i*2);
            this.addOnlineList(client_id);
        }
    },
    clientLogOut : function () {
        var opcode = 1 <<14;
        var data = new Uint16Array(1);
        data[0] = opcode;
        var blob = new Blob([data]);
        this.ws.send(blob);
    },
    offlineInfo : function (appData) {
        var clientNum = appData.readUInt16BE(2);
        var client_id = 0;
        for(var i=0;i<clientNum;i++){
            client_id = appData.readUInt16BE(4+i*2);
            this.delOnlineList(client_id);
        }
    },
    buildUp : function () {
        var chat_plane = $('<div id="chat_plane"></div>');
        this.DOMS['chat_plane'] = chat_plane;
        $('body').append(chat_plane);
        var onlineBoard = $('<div id="online_board" class="btn"></div>');
        chat_plane.append(onlineBoard);
        var onlineList = $('<ol id="online_list" class="unstyled"></ol>');
        this.DOMS['onlineList'] =onlineList;
        onlineBoard.append(onlineList);
        onlineList.selectable();
    },
    addOnlineList : function (client_id) {
        var li = $('<li clientid="'+client_id+'">'+client_id+'</li>');
        this.DOMS['onlineList'].append(li);
    },
    delOnlineList : function (client_id) {
        this.DOMS['onlineList'].find('li[clientid="'+client_id+'"]').remove();
    }
};

