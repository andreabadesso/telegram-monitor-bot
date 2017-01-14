'use strict';

const util = require('util'),
        events = require('events'),
        MessageParser = require('../utils/message-parser.js'),
        bunyan = require('bunyan');

const logger = bunyan.createLogger({
    name: 'APIConnection'
});

class APIConnection extends events.EventEmitter {
    constructor(socket) {
        super();
    }
}

module.exports = APIConnection;
