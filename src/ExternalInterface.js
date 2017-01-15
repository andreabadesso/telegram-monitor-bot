'use strict';

const util = require('util'),
        events = require('events'),
        bunyan = require('bunyan');

const logger = bunyan.createLogger({
    name: 'ExternalInterface'
});

class ExternalInterface extends events.EventEmitter {
    constructor(server, bot) {
        super();

        this.server = server;
        this.bot = bot;

        logger.info('Registering routes');
        this.registerRoutes();
    }

    sendMessage(req, res, next) {
        logger.info(`Sending ${req.body.message} to ${req.params.id}`);
        this.bot.sendMessage(req.params.id, req.body.message)
            .then(() => {
                res.send({
                    status: 200,
                    message: 'Message sent'
                });
            }, err => {
                logger.error(err);
                res.send({
                    status: 500,
                    err: err
                });
            });
    }

    registerRoutes() {
        this.server.post('/send_message/user/:id', this.sendMessage.bind(this));
        this.server.post('/send_message/group/:id', this.sendMessage.bind(this));
    }
}

module.exports = ExternalInterface;
