# SC2 - INFO

Information about SC2 Units, Buildings, Upgrades,  Weapons and more

## Explanation of Projects

### 1. [External] SC2 Map Editor has ability to export balance data.

This generates a folder of unit data formatted in XML. This is done manually on the local machine with sc2 installed.

### 2. convertBalanceData

converts the XML to JSON format and outputs a such as 'balancedata.4.12.1.json'.

- As part of conversion if fixes various issues with switched names and ids and fields missing. The XML is de-normalized but has references and the JSON is somewhat more normalized.
- This JSON uploaded to Azure blob storage for consumption

### 3. Question Generator

Given the JSON file of sc2 balance data. Generate questions about features of the units and buildings in different formats:

- Language Understanding service .lu down: `sc2info-bot.lu`
- QnA Knowledge  Base file: `qnaKnowledgeBase.json`
- Sc2IQ db input file (custom format): `questionInputs.json`

### 4. Question Extractor

Given a string, extract units, buildings, or weapons and the features to correlated with an question
E.g. "How much does a marine cost?" -> `{ type: unit, unit: marine, features: ['cost'] }`

### Models Creators

### 3. Question Generator (HTTP portion)

Sends the 

#### KB Creator

Reads a file output by the generator such as 'qnaKnowledgeBase.json' and creates a new KB.

#### LUIS Model Creator 

Reads a file  output by the generator such as 'sc2info-bot.lu' and creates a new model.

### Web Site

#### Service for sc2info.com

A GraphQL based API that outputs data from the .JSON file.

#### Client for sc2info.com

A React web-based client which becomes sc2info.com

### Bots

#### Commands [Utility]

Generic bot command processor. Carries out the actions and is shared core of all bots.  In other words common functionality between bot platforms is they all input strings and output strings.

E.g. Users can ask question using '!question' and it will respond.

#### Discord Bot

Bot for Discord

#### Twitch Bot

Bot for Twitch

## Other Tools

### Type Graph QL Test

This is attempt to use https://typegraphql.com/ instead of manually defining definitions and deal with TypeScript compatibility.

It seems mostly complete but would need to test. Mainly questions about Union types.

## Resources

This repository uses npm@7 for package consolidation

See Announcement: https://github.blog/2020-10-13-presenting-v7-0-0-of-the-npm-cli/
See Workspaces RFC: https://github.com/npm/rfcs/blob/latest/implemented/0026-workspaces.md