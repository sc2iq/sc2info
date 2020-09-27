# Discord Bot to answer questions about sc2 information using SC2INFO.com api.

This should be almost exact copy of [twitch](../twitch/README.md) bot.

This bot will attempt match messages from users into questions which can be answered with discrete values from the api.

Example: "How much does a marine cost?"
Answer: 

```
A marine costs: 50 minerals

http://sc2info.com/units/marine
```

It's important to restate what the bot interpreted such as "A marine costs...." so the user can determine if the answer is related and know to re-ask in a different way.

## References

- [How to build a Bot](https://www.digitalocean.com/community/tutorials/how-to-build-a-discord-bot-with-node-js)
- [Documentation on Discord Bots](https://discord.js.org/#/docs)

## Dependencies

- Use luis model generator to extract information from message to determine which question they are asking.
  - [https://www.luis.ai/](https://www.luis.ai/)
