# SC2 - INFO

Information about SC2 Units, Buildings, Upgrades,  Weapons and more

## Process of between Projects 

### 1. SC2 Map Editor has ability to export balance data.

This generates a folder of unit data formatted in XML

### 2. convertBalanceData

converts the XML to JSON format and outputs a file.

- As part of conversion if fixes various issues with switched names and ids and fields missing. The XML is de-normalized but has references and the JSON is somewhat more normalized.
- This JSON uploaded to Azure blob storage for consumption

### 3. Service

A GraphQL based API that outputs data from the .JSON file.

### 4. Client

A React web-based client which becomes sc2info.com

## Other Tools

### KB Generator

Attempt to generate Azure QnA Maker knowledge based from the `balancedata.json`

### Question Generator

This generates questions for sc2iq, which can be submitted to the database.

### Type Graph QL Test

This is attempt to use https://typegraphql.com/ instead of manually defining definitions and deal with TypeScript compatibility.

It seems mostly complete but would need to test. Mainly questions about Union types.