'use strict';

const util = require('util'),
        events = require('events'),
        MessageParser = require('../utils/message-parser.js'),
        bunyan = require('bunyan');

const logger = bunyan.createLogger({
    name: 'ExternalInterface'
});

class ExternalInterface extends events.EventEmitter {
    constructor(socket) {
        super();
    }
}

module.exports = ExternalInterface;
