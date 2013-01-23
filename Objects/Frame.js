var Frame = function () {
    this.FIN = null;
    this.RSV1 = null;
    this.RSV2 = null;
    this.RSV3 = null;
    this.OPCODE = null;
    this.MASK = null;
    this.PAYLOAD_LEN = null;
    this.EXTENDED_PAYLOAD_LENGTH = null;
    this.MASKING_KEY = null;
    this.PAYLOAD = null;
};
Frame.FIN = 128;
Frame.RSV1 = 64;
Frame.RSV2 = 32;
Frame.RSV3 = 16;
Frame.OPCODE_CONTINUATION = 0;
Frame.OPCODE_TEXT = 1;
Frame.OPCODE_BINARY = 2;
Frame.OPCODE_CLOSE = 8;
Frame.OPCODE_PING = 9;
Frame.OPCODE_PONG = 10;
Frame.MASK = 128;
Frame.prototype = {
    constructor : Frame,
    decode : function (buffer) {
        var i=0;
        var byte = buffer[i++];
        this.FIN = (byte & 128)>>7;
        this.RSV1 = (byte & 64)>>6;
        this.RSV2 = (byte & 32)>>5;
        this.RSV3 = (byte & 16)>>4;
        this.opcode = byte & 15;
        /*var type;
        switch (opcode) {
            case 0x0:
                type = 'continuation';
                break;
            case 0x1:
                type = 'text';
                break;
            case 0x2:
                type = 'binary';
                break;
            case 0x8:
                type = 'close';
                break;
            case 0x9:
                type = 'ping';
                break;
            case 0xA:
                type = 'pong';
                break
            default:
                console.error('Undefined Frame Type!');
                return;
        }*/
        byte = buffer[i++];
        this.MASK = (byte & 128) >>7;
        this.PAYLOAD_LEN = byte & 127;
        if(this.PAYLOAD_LEN == 126) {
            this.EXTENDED_PAYLOAD_LENGTH = buffer.readUInt16BE(i);
            i+=2;
        }
        if(this.PAYLOAD_LEN == 127) {
           //TODO
        }
        if(this.MASK == 1) {
            this.MASKING_KEY = new Buffer(4);
            buffer.copy(this.MASKING_KEY,0,i,i+4);
            i+=4;
        }
        if( this.PAYLOAD_LEN <126) {
            this.PAYLOAD = new Buffer(this.PAYLOAD_LEN);
            buffer.copy(this.PAYLOAD,0,i,i+this.PAYLOAD_LEN);
        } else {
            this.PAYLOAD = new Buffer(this.EXTENDED_PAYLOAD_LENGTH);
            buffer.copy(this.PAYLOAD,0,i,i+this.EXTENDED_PAYLOAD_LENGTH);
        }
        //unmasking
        var i,j;
        for(i=0;i<this.PAYLOAD.length;i++) {
            j = i % 4;
            this.PAYLOAD[i] = this.PAYLOAD[i] ^ this.MASKING_KEY[j];
        }
    },
    encode : function () {
        var frame_length = 2;
        if(this.MASK == 1){
            frame_length += 4;
        }
        if(this.PAYLOAD_LEN < 126) {
            frame_length += this.PAYLOAD_LEN;
        } else if(this.PAYLOAD_LEN == 126){
            frame_length += 2;
            frame_length += this.EXTENDED_PAYLOAD_LENGTH;
        } else if(this.PAYLOAD_LEN == 127) {
            frame_length += 8;
            frame_length += this.EXTENDED_PAYLOAD_LENGTH;
        }
        var frame = new Buffer(frame_length);
        var byte = 0;
        if(this.FIN == 1) {
            byte += Frame.FIN;
        }
        if(this.RSV1 == 1) {
            byte += Frame.RSV1;
        }
        if(this.RSV2 == 1) {
            byte += Frame.RSV2;
        }
        if(this.RSV3 == 1) {
            byte += Frame.RSV3;
        }
        byte += this.OPCODE;
        frame[0] = byte;
        byte = 0;
        if(this.MASK == 1) {
            byte += Frame.MASK;
        }
        var offset = 0;
        if(this.PAYLOAD_LEN < 126) {
            byte += this.PAYLOAD_LEN;
            frame[1] = byte;
            byte = 0;
        } else if (this.PAYLOAD_LEN == 126) {
            byte += 126;
            frame[1] = byte;
            byte = 0;
            frame.writeUInt16BE(this.EXTENDED_PAYLOAD_LENGTH,2);
            offset = 2;
        } else if (this.PAYLOAD_LEN == 127) {
            //TODO
        }
        if(this.MASK == 1) {
            this.MASKING_KEY.copy(frame,2+offset,0,3);
            offset +=4;
        }
        this.PAYLOAD.copy(frame,2+offset,0,this.PAYLOAD.length);
        return frame;
    }
};
module.exports = Frame;
