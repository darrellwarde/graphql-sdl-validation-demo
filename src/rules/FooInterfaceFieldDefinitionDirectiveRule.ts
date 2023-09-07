import {
  ASTNode,
  ASTVisitor,
  DirectiveNode,
  GraphQLError,
  Kind,
} from "graphql";
import { SDLValidationContext } from "graphql/validation/ValidationContext";

export function FooInterfaceFieldDefinitionDirectiveRule(
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

      if (directiveName === "foo") {
        if (!directiveOnFieldDefinition(ancestors)) {
          // this validation is carried out by KnownDirectivesRule
          return;
        }

        const pathObject = pathToPathObject(path);

        const parentTypeDefinition = (ancestors[1] as ReadonlyArray<ASTNode>)[
          pathObject.definitions
        ] as ASTNode;

        if (parentTypeDefinition.kind !== Kind.INTERFACE_TYPE_DEFINITION) {
          context.reportError(
            new GraphQLError(
              `Directive "@${directiveName}" can only be used on interface field definitions.`,
            ),
          );
        }
      }
    },
  };
}

type PathObject = {
  definitions: number;
  fields: number;
  directives: number;
};

function pathToPathObject(path: ReadonlyArray<string | number>): PathObject {
  const definitionsPath = path.findIndex((value) => value === "definitions");
  if (definitionsPath === -1) {
    throw new Error("Could not find definitions key in path.");
  }
  const definitions = path[definitionsPath + 1] as number;

  const fieldsPath = path.findIndex((value) => value === "fields");
  if (fieldsPath === -1) {
    throw new Error("Could not find fields key in path.");
  }
  const fields = path[fieldsPath + 1] as number;

  const directivesPath = path.findIndex((value) => value === "directives");
  if (directivesPath === -1) {
    throw new Error("Could not find directives key in path.");
  }
  const directives = path[directivesPath + 1] as number;

  return {
    definitions,
    fields,
    directives,
  };
}

function directiveOnFieldDefinition(
  ancestors: ReadonlyArray<ASTNode | ReadonlyArray<ASTNode>>,
): boolean {
  // get the definition to which the directive was applied to
  const parent = ancestors.slice(-1)[0] as ASTNode;
  return parent.kind === Kind.FIELD_DEFINITION;
}
