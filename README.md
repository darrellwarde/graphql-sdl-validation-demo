# GraphQL validation demo

## Setup

```sh
npm i
```

## Running

```sh
npm start
```

## Background

This project demonstrates a few simple custom GraphQL SDL validation rules:

- `DirectiveArgumentOfCorrectTypeRule` - fetches the definition for the directive from the schema, and validates that the directive arguments are of the correct type.
- `FooInterfaceFieldDefinitionDirectiveRule` - a business logic rule that validates that the `@foo` directive is only used on interface field definitions.
- `BarRequiresFooDirectiveRule` - a business logic rule that validates that any applications of the `@bar` directive are accompanied by a `@foo` directive.
