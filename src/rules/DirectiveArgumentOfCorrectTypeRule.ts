import {
  ASTNode,
  ASTVisitor,
  DirectiveNode,
  GraphQLError,
  GraphQLSchema,
  buildASTSchema,
  coerceInputValue,
  print,
  valueFromASTUntyped,
} from "graphql";
import { SDLValidationContext } from "graphql/validation/ValidationContext";

export function DirectiveArgumentOfCorrectTypeRule(
  context: SDLValidationContext,
): ASTVisitor {
  return {
    Directive(
      node: DirectiveNode,
      key: string | number | undefined,
      parent: ASTNode | ReadonlyArray<ASTNode> | undefined,
      path: ReadonlyArray<string | number>,
      ancestors: ReadonlyArray<ASTNode | ReadonlyArray<ASTNode>>,
    ) {
      if (node.arguments) {
        const schema = getSchema(context);

        const directiveName = node.name.value;
        const directiveDefinition = schema.getDirective(directiveName);

        if (!directiveDefinition) {
          // this validation is carried out by KnownDirectivesRule
          return;
        }

        for (const argument of node.arguments) {
          const argumentName = argument.name.value;

          // get the argument definition from the directive definition
          const argumentDefinition = directiveDefinition.args.find(
            (arg) => arg.name === argumentName,
          );

          if (!argumentDefinition) {
            // this validation is carried out by KnownArgumentNamesOnDirectivesRule
            continue;
          }

          const inputType = argumentDefinition.type;
          const inputValue = valueFromASTUntyped(argument.value);

          // try to coerce the argument value given the definition type, and report the error if this fails
          coerceInputValue(inputValue, inputType, () =>
            context.reportError(
              new GraphQLError(
                `Expected argument "${argumentName}" on directive "@${directiveName}" to have type "${inputType.toString()}", found ${print(
                  argument.value,
                )}.`,
              ),
            ),
          );
        }
      }
    },
  };
}

function getSchema(context: SDLValidationContext): GraphQLSchema {
  const document = context.getDocument();
  return buildASTSchema(document, {
    assumeValid: true,
    assumeValidSDL: true,
  });
}
