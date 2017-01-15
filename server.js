'use strict';

const TelegramBot     = require('node-telegram-bot-api'),
    request           = require('request'),
    _                 = require('lodash'),
    Q                 = require('q'),
    token             = process.env.MONITOR_BOT_TOKEN,
    API               = process.env.MIDDLEWARE_API,
    HTTP_PORT         = process.env.HTTP_PORT,
    bunyan            = require('bunyan'),
    moment            = require('moment'),
    ExternalInterface = require('./src/ExternalInterface');


const http     = require('http'),
    express    = require('express'),
    app        = express(),
    server     = http.Server(app),
    bodyParser = require('body-parser');

const logger = bunyan.createLogger({
    name: 'MonitorBot'
});

// Setup polling way
const bot = new TelegramBot(token, {
    polling: true
});

// Installing HTTP Server

let apiRoutes = express.Router();
let externalInterface = new ExternalInterface(apiRoutes, bot);

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(apiRoutes);

externalInterface.registerRoutes();

app.listen(HTTP_PORT, () => {
    logger.info('Monitor HTTP server started at', HTTP_PORT);
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
