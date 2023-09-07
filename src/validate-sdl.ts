import { DocumentNode, GraphQLError } from "graphql";
import { specifiedSDLRules } from "graphql/validation/specifiedRules";
import { validateSDL as validate } from "graphql/validation/validate";
import { DirectiveArgumentOfCorrectTypeRule } from "./rules/DirectiveArgumentOfCorrectTypeRule";
import { FooInterfaceFieldDefinitionDirectiveRule } from "./rules/FooInterfaceFieldDefinitionDirectiveRule";
import { BarRequiresFooDirectiveRule } from "./rules/BarRequiresFooDirectiveRule";

export function validateSDL(
  documentAST: DocumentNode,
): ReadonlyArray<GraphQLError> {
  const errors = validate(documentAST, undefined, [
    ...specifiedSDLRules,
    DirectiveArgumentOfCorrectTypeRule,
    FooInterfaceFieldDefinitionDirectiveRule,
    BarRequiresFooDirectiveRule,
  ]);

  return errors;
}
