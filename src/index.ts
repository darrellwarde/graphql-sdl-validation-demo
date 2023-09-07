import { parse } from "graphql";
import { validateSDL } from "./validate-sdl";

const typeDefs = /* GraphQL */ `
  directive @foo(bar: String!) on FIELD_DEFINITION
  directive @bar on FIELD_DEFINITION

  interface Foo {
    bar: String! @foo(bar: "bar")
  }

  type Foo implements Foo {
    bar: String! @foo(bar: 647)
  }

  type Bar @foo(bar: "bar") {
    foo: Int! @bar
  }

  type Query {
    foo: Foo!
    bar: Bar!
  }
`;

const documentAST = parse(typeDefs);

const errors = validateSDL(documentAST);

console.log(`Encountered ${errors.length} validation errors:`);

console.log();

errors.forEach((error) => {
  console.log(error.message);
  console.log();
});
