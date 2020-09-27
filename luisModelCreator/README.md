# LUIS Model Generator

This will attempt extract sc2 related information from text messages. This will allow them to be associated with questions which can be answered with discrete values from the SC2INFO api.

Example: "How much does a marine cost?"
Answer: 

```
A marine costs: 50 minerals

http://sc2info.com/units/marine
```

It's important to restate what the bot interpreted such as "A marine costs...." so the user can determine if the answer is related and know to re-ask in a different way.

## LU Generation

- 4 Entities:
    - Unit
    - Building
    - Weapon
    - Property (nexted variations?)
        cost
            cost minerals
            cost vespene
        etc
- 2 Intents
    - Ask question
    - None

### Phrase List

https://docs.microsoft.com/en-us/azure/bot-service/file-format/bot-builder-lu-file-format?view=azure-bot-service-4.0#phrase-list-definition

```
@ phraseList Want =
    - require
	- need
	- desire
	- know
```

### Using Phrase Lists on Entity

https://docs.microsoft.com/en-us/azure/bot-service/file-format/bot-builder-lu-file-format?view=azure-bot-service-4.0#tie-features-to-a-specific-model

```
> phrase list as a feature to an ml entity.

@ ml myCity usesFeature PLCity
```

## Limits

- Intents	500 per application
- A limit of either 100 parent entities or 330 entities, whichever limit the user hits first. A role counts as an entity for the purpose of this limit. An example is a composite with a simple entity, which has 2 roles is: 1 composite + 1 simple + 2 roles = 4 of the 330 entities.
Subentities can be nested up to 5 levels.

## References

- [LUIS Authoring](https://www.npmjs.com/package/@azure/cognitiveservices-luis-authoring)
- [LUIS REST API](https://westeurope.dev.cognitive.microsoft.com/docs/services/luis-programmatic-apis-v3-0-preview/operations/5890b47c39e2bb052c5b9c31)
- [LUIS limit](https://docs.microsoft.com/en-us/azure/cognitive-services/luis/luis-limits)
- [LUIS .json file](./sc2info-bot.json)
- [LUIS .lu files](./sc2info-bot.lu)
- [LUIS Swagger Definition](https://westus.dev.cognitive.microsoft.com/docs/services/luis-programmatic-apis-v3-0-preview/export?DocumentFormat=Swagger&ApiName=LUIS%20Programmatic%20APIs%20v3.0-preview)
- [LU file format](https://docs.microsoft.com/en-us/azure/bot-service/file-format/bot-builder-lu-file-format?view=azure-bot-service-4.0)

Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.

Why do we use it?
It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).

