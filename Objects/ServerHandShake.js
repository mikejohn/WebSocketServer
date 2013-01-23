/*
    HTTP/1.1 101 Switching Protocols
    Upgrade: websocket
    Connection: Upgrade
    Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=
    Sec-WebSocket-Protocol: chat
*/
var ServerHandShake = function () {
    this.params = [];
};
ServerHandShake.prototype = {
    constructor : ServerHandShake,
    generate : function (clientHandShake) {
        if(clientHandShake.params['Sec-Web-Protocol']!== undefined) {
            this.params['Sec-Web-Protocol'] = clientHandShake.params['Sec-Web-Protocol'];
        }
        var key = clientHandShake.params['Sec-WebSocket-Key'];
        key += '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';
        var crypto = require('crypto').createHash('sha1');
        crypto.update(key);
        this.params['Sec-WebSocket-Accept'] = crypto.digest('base64');
        if(this.params['Connection'] === undefined) {
            this.params['Connection'] = ServerHandShake.Connection;
        }
        if(this.params['Upgrade'] === undefined) {
            this.params['Upgrade'] = ServerHandShake.Upgrade;
        }
    },
    encode : function () {
        var s = ServerHandShake.FirstLine,line='';
        for(var name in this.params) {
            line = name + ': '+ this.params[name]+'\r\n';
            s += line;
        }
        return s+='\r\n';
    },
    set : function () {

    },
    get : function () {

    }
};
ServerHandShake.FirstLine = 'HTTP/1.1 101 Switching Protocols\r\n';
ServerHandShake.Connection = 'Upgrade';
ServerHandShake.Upgrade = 'websocket';
module.exports = ServerHandShake;
