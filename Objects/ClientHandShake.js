var ClientHandShake = function (string) {
    this.params = [];
    if(string !== undefined) {
        this.decode(string);
    }
};
ClientHandShake.prototype = {
    constructor : ClientHandShake,
    decode : function (data) {
        var lines = data.split('\r\n');
        var line_1st = lines[0];
        var parts = line_1st.split(' ');
        this.params['HTTPMethod'] = parts[0];
        this.params['HTTPVersion'] = (parts[2].split('/'))[1];
        var line,name_value,name,value;
        for(var i=1;i<lines.length;i++) {
            line = lines[i];
            name_value = line.split(': ');
            name = name_value[0];
            value = name_value[1];
            this.params[name] = value;
        }
    },
    authority : function () {
        //1.    An HTTP/1.1 or higher GET request
        if(this.params['HTTPVersion'] < 1.1) {
            return false;
        }
        if(this.params['HTTPMethod'] != 'GET') {
            return false;
        }
        //2.   A |Host| header field containing the server's authority.
        //this.params['HOST']

        //3.   An |Upgrade| header field containing the value "websocket"
        if(this.params['Upgrade'] !== 'websocket') {
            return false;
        }

        //4.   A |Connection| header field that includes the token "Upgrade"
        if(this.params['Connection'] !== 'Upgrade') {
            return false;
        }
        //5.    A |Sec-WebSocket-Key| header field with a base64-encoded value that, when decoded, is 16 bytes in length.
        var b = new Buffer(this.params['Sec-WebSocket-Key'], 'base64')
        if(b.length != 16) {
            return false;
        }
        //6.   A |Sec-WebSocket-Version| header field, with a value of 13.
        if(this.params['Sec-WebSocket-Version'] !== 13) {
            return false;
        }
    },
    encode : function () {

    },
    set : function (name,value) {
        this.params[name] = value;
    },
    get : function (name) {
        return this.params[name];
    }
};
module.exports = ClientHandShake;
