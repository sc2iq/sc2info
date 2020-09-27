# SC2INFO Question Extractor

Given a string, extract units, buildings, and weapons to correlate with an question

Full scenario it will be used a component in twitch bot and receive message and translate to request for question to return an answer.

This will attempt extract sc2 related information from text messages. This will allow them to be associated with questions which can be answered with discrete values from the SC2INFO api.

Example: "How much does a marine cost?"
Answer: 

```
A marine costs: 50 minerals

http://sc2info.com/units/marine
```

It's important to restate what the bot interpreted such as "A marine costs...." so the user can determine if the answer is related and know to re-ask in a different way.

## Getting Started

Sample Code

```typescript
import sc2extractor from '@sc2/extractor'

function answerQuestion(question: string) {
    const extraction = await sc2extractor(question)
    return extraction.answer
}
```

## Considerations

Due to the large amount of message being processed making requests to LUIS seems unpractical.
Perhaps use this as preprocess and LUIS for those who pass through first stage.

## References

- [Code Sandbox](https://codesandbox.io/s/practical-water-ghf1n?file=/src/index.ts)
- [Fuse.js](https://fusejs.io/api/options.html)
