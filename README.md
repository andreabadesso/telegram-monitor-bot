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

* `/send_message/user/:id` The bot will send a message to this user id
* `/send_message/group/:id` The bot will send a message to this group id

#### Example

`curl -X POST "http://localhost:4000/send_message/user/1823811" -H "Content-Type: application/json" -d '{"message":
"Teste"}'`

### Running with Docker:

```
docker build -t keeptrack/telegram-monitor .
docker run -e "MONITOR_BOT_TOKEN=<TOKEN>" -e "MIDDLEWARE_API=<MIDDLEWARE_API>", -e "HTTP_PORT=<HTTP_PORT>" -p 4000:4000 -d keeptrack/telegram-middleware
```

#### Example:

```
docker build -t keeptrack/telegram-monitor .
docker run -e "MONITOR_BOT_TOKEN=5881281:H9Aasjs9aAja9j9a9jsaj" -e "MIDDLEWARE_API=http://localhost:3000/telegram", -e "HTTP_PORT=4000" -p 4000:4000 -d keeptrack/telegram-middleware
```
