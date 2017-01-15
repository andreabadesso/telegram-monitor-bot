## Telegram Monitor Bot

1. Create a BOT on BotFather (https://telegram.me/BotFather)
2. Turn privacy off by writing /setprivacy on BotFather

### You need to define these ENV Variables:

```
MONITOR_BOT_TOKEN=<Token from BotFather>
MIDDLEWARE_API=<Url the messages received will be sent to>
HTTP_PORT=<Port the http server will be listening on>
```

### APIs Exposed:

`/send_message/user/:id` The bot will send a message to this user id
`/send_message/group/:id` The bot will send a message to this group id
