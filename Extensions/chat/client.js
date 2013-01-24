var ChatClient = function () {
    this.ws;
    this.protocolHandler = new Client_ChatProtocolHandler();
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
            that.ws.send(that.protocolHandler.playerSignIn());
        };
        this.ws.onmessage = function (socket) {
            console.dir(socket);
        };
        this.ws.onclose = function (close) {
            console.dir(close);
            console.log("Connection close");
        };
        this.ws.onerror = function (error) {
            console.dir(error);
        };
    },
    buildUp : function () {
        var chat_plane = $('<div id="chat_plane"></div>');
        $('body').append(chat_plane);
        var onlineBoard = $('<div id="online_board" class="btn"></div>');
        chat_plane.append(onlineBoard);
        var onlineList = $('<ol id="online_list" class="unstyled"></ol>');
        onlineBoard.append(onlineList);
        var one = $('<li>1</li>');
        var two = $('<li>2</li>');
        onlineList.append(one);
        onlineList.append(two);
        onlineList.selectable();
    }
};

