'use strict';

const TelegramBot = require('node-telegram-bot-api'),
    request = require('request'),
    _ = require('lodash'),
    Q = require('q'),
    token = process.env.MONITOR_BOT_TOKEN,
    API = process.env.MIDDLEWARE_API,
    bunyan = require('bunyan'),
    moment = require('moment');

const logger = bunyan.createLogger({
    name: 'MonitorBot'
});

// Setup polling way
const bot = new TelegramBot(token, {
    polling: true
});

function _sendMessage(groupMessage) {
    console.log(API);
    request.post({
            url: API,
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            json: groupMessage
        },
        function(err, httpResponse, body) {
            if (err) {
                return logger.error(err);
            }
            logger.info(body);
        });
}

function groupMessageReceived(message) {
    let time = moment(message.time).toISOString();
    let groupMessage = {
        id: '' + Math.abs(message.chat.id),
        body: message.text,
        time: time,
        from: {
            first_name: message.from.first_name,
            last_name: message.from.last_name,
            userId: '' + message.from.id
        }
    };

    logger.info('Sending', groupMessage);

    if (message.hasOwnProperty('photo')) {
        let fileId = message.photo[2].file_id;

        request.get({
            url: `https://api.telegram.org/bot${token}/getFile?file_id=${fileId}`
        }, (err, httpResponse, body) => {
            body = JSON.parse(body);
            let filePath = `https://api.telegram.org/file/bot${token}/${body.result.file_path}`;
            groupMessage.type = 'photo';
            groupMessage.url = filePath;
            groupMessage.body = `${filePath}`;
            _sendMessage(groupMessage);

            logger.info('FILE PATH: ', filePath);
        });
    } else {
        _sendMessage(groupMessage);
    }
}

bot.on('message', msg => {
    logger.info(msg);
    groupMessageReceived(msg);
});
