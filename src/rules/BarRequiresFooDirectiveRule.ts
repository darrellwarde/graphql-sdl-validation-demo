import {
  ASTNode,
  ASTVisitor,
  DirectiveNode,
  FieldDefinitionNode,
  GraphQLError,
  Kind,
} from "graphql";
import { SDLValidationContext } from "graphql/validation/ValidationContext";

export function BarRequiresFooDirectiveRule(
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
      const directiveName = node.name.value;

      if (directiveName === "bar") {
        if (parent && Array.isArray(parent)) {
          if (
            !parent.some(
              (directive) => (directive as DirectiveNode).name.value === "foo",
            )
          ) {
            context.reportError(
              new GraphQLError(
                `Directive "@${directiveName}" must be used with directive "@foo".`,
              ),
            );
          }
        }
      }
    },
  };
}
