var Log = function (fileFullPath) {
    this.fileFullPath = fileFullPath;
    this.filePointer = null;
    this.fs = require('fs');
};
Log.prototype = {
    init : function () {
        var that = this;
        this.fs.open('./../Test/test.txt', 'a', function opened(err, fd) {
            console.log('open');
            console.dir(err);
            if (err) { throw err; }
            console.log(fd);
            that.filePointer = fd;
        });
    },
    closeFile : function () {

    },
    log : function () {
        var writeBuffer = new Buffer('writing this string'),
            bufferPosition = 0,
            bufferLength = writeBuffer.length, filePosition = 0;
        this.fs.write( this.filePointer,
            writeBuffer,
            bufferPosition,
            bufferLength,
            filePosition,
            function wrote(err, written) {
                if (err) { throw err; }
                console.log('wrote ' + written + ' bytes');
            });
    },
    debug : function () {

    },
    error : function () {

    }
};
module.exports = Log;
