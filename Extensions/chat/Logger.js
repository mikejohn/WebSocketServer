var Logger = function (fileFullPath) {
    var path = require('path');
    this.fileFullPath = path.resolve(fileFullPath);
    this.fs = require('fs');
    this.ws = null;
};
Logger.prototype = {
    init : function () {
        this.ws = this.fs.createWriteStream(this.fileFullPath, { flags: 'a',encoding: 'utf8' });
    },
    close : function () {
        this.ws.end();
    },
    log : function (string) {
        var time = new Date();
        time = time.toLocaleString();
        this.ws.write('LOG '+time+' '+string);
    },
    debug : function (string) {
        var time = new Date();
        time = time.toLocaleString();
        this.ws.write('DEBUG '+time+' '+string);
    },
    error : function (string) {
        var time = new Date();
        time = time.toLocaleString();
        this.ws.write('ERROR '+time+' '+string);
    }
};
module.exports = Logger;
