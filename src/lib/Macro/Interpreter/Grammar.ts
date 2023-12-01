import { rule, not, either, exactly, optional, minOf, token } from "./RuleHelpers";
import type { GBinary, GCheck, GExpression, GValue, Statement, Token } from "./Types";

// LineStatement -> IfExpressionStatement | AssignmentStatement | FunctionStatement
export const LineStatement = rule(
    () => either(
        IfExpressionStatement,
        IfElseExpressionStatement,
        WhileExpressionStatement,
        AssignmentStatement,
        FunctionStatement
    ),
    (expression: GExpression) => expression
);

// // IfElseExpressionStatement -> IfKeyword PStart Expression PEnd CodeBlock ElseKeyword CodeBlock
const IfElseExpressionStatement = rule(
    () => exactly(IfKeyword, PStart, Expression, PEnd, CodeBlock, ElseKeyword, CodeBlock),
    ([, , check, , ifStatements, , elseStatements]: [null, null, GCheck, null, Array<Statement>, null, Array<Statement>]) => ({ type: 'ifelse', check, ifStatements, elseStatements })
)

// WhileExpressionStatement -> WhileKeyword PStart Expression PEnd CodeBlock
const WhileExpressionStatement = rule(
    () => exactly(WhileKeyword, PStart, Expression, PEnd, CodeBlock),
    ([, , check, , statements]: [null, null, GCheck, null, Array<Statement>]) => ({ type: 'while', check, statements })
)

// IfExpressionStatement -> IfKeyword PStart Expression PEnd CodeBlock !ElseKeyword
const IfExpressionStatement = rule(
    () => exactly(IfKeyword, PStart, Expression, PEnd, CodeBlock, not(ElseKeyword)),
    ([, , check, , statements]: [null, null, GCheck, null, Array<Statement>]) => ({ type: 'if', check, statements})
)

// CodeBlock -> BStart LineStatement* BEnd
const CodeBlock = rule(
    () => exactly(BStart, minOf(0, LineStatement), BEnd),
    ([, statements]: [null, Array<Statement>]) => statements
);

// FunctionStatement -> FunctionExpression Eol
const FunctionStatement = rule(
    () => exactly(FunctionExpression, Eol),
    ([expression]: [GExpression]) => expression
);

// FunctionExpression -> Name PStart FunctionParameters? PEnd
const FunctionExpression = rule(
    () => exactly(Name, PStart, optional(FunctionParameters, []), PEnd),
    ([name, _, parameters]: [GExpression, null, Array<GCheck | GBinary>]) => ({
        type: 'function',
        name: name.value,
        parameters
    })
);

// FunctionParameters -> Expression (Comma Expression)*
const FunctionParameters = rule(
    () => exactly(Expression, minOf(0, exactly(Comma, Expression))),
    ([first, rest]: [any, any]) => [first, ...rest.map(([_, parameter]: [null, any]) => parameter)]
);

// AssignmentStatement -> Name Equals Expression Eol
const AssignmentStatement = rule(
    () => exactly(Name, Equals, Expression, Eol),
    ([name, , expression]: [GExpression, null, GExpression]) => ({ type: 'assignment', name: name.value, expression })
);


const processBinaryResult = ([left, right]: [any, [any]]) => {
    let expression: GCheck = left;
    for (const [operator, rightSide] of right) {
        expression = {
            type: 'operation',
            operation: operator.value,
            left: expression,
            right: rightSide
        };
    }
    return expression;
};

// Expression -> EqualityTerm ((And | Or) EqualityTerm)*
const Expression = rule(
    () => exactly(EqualityTerm, minOf(0, exactly(either(And, Or), EqualityTerm))),
    processBinaryResult
);

// EqualityTerm -> RelationTerm ((DoubleEquals | NotEquals) RelationTerm)*
const EqualityTerm = rule(
    () => exactly(RelationTerm, minOf(0, exactly(either(DoubleEquals, NotEquals), RelationTerm))),
    processBinaryResult
);

// EqualityTerm -> AddSubTerm ((Less | Greater | LessEquals | GreaterEquals) AddSubTerm)*
const RelationTerm = rule(
    () => exactly(AddSubTerm, minOf(0, exactly(either(Less, Greater, LessEquals, GreaterEquals), AddSubTerm))),
    processBinaryResult
);

// AddSubTerm -> MulDivTerm ((Add | Subtract) MulDivTerm)*
const AddSubTerm = rule(
    () => exactly(MulDivTerm, minOf(0, exactly(either(Add, Subtract), MulDivTerm))),
    processBinaryResult
);

// MulDivTerm -> UnaryTerm ((Multiply | Divide) UnaryTerm)*
const MulDivTerm = rule(
    () => exactly(UnaryTerm, minOf(0, exactly(either(Multiply, Divide), UnaryTerm))),
    processBinaryResult
);

// UnaryTerm -> Not? Factor
const UnaryTerm = rule(
    () => exactly(optional(Not), Factor),
    ([addedNot, value]: [GValue | GExpression, GValue | GExpression]) => ({
        type: 'unary',
        withNot: addedNot.type !== 'optional',
        value
    })
);

// Factor -> GroupExpression | FunctionExpression | NumberExpression | VariableExpression | StringExpression
const Factor = rule(
    () => either(GroupExpression, FunctionExpression, NumberExpression, VariableExpression, StringExpression),
    (factor: GExpression) => factor
);

// GroupExpression -> PStart Expression PEnd
const GroupExpression = rule(
    () => exactly(PStart, Expression, PEnd),
    ([, expression]: [null, GExpression]) => expression
);

// VariableExpression -> Name
const VariableExpression = rule(
    () => Name,
    (name: GExpression) => ({
        type: 'variable',
        name: name.value
    })
);

// NumberExpression -> Number
const NumberExpression = rule(
    () => Number,
    (number: GExpression) => ({
        type: 'number',
        value: number.value
    })
);

// StringExpression -> String
const StringExpression = rule(
    () => String,
    (string: GExpression) => ({
        type: 'string',
        value: string.value
    })
);

// Tokens
const Number = token('number');
const String = token('string');
const Name = token('name');
const Equals = token('operator', '=');
const PStart = token('parenStart');
const PEnd = token('parenEnd');
const BStart = token('codeBlockStart');
const BEnd = token('codeBlockEnd');
const Comma = token('comma');
const Eol = token('endOfLine');
const IfKeyword = token('keyword', 'if');
const ElseKeyword = token('keyword', 'else');
const WhileKeyword = token('keyword', 'while');
const And = token('operator', '&&');
const Or = token('operator', '||');
const DoubleEquals = token('operator', '==');
const NotEquals = token('operator', '!=');
const Less = token('operator', '<');
const Greater = token('operator', '>');
const LessEquals = token('operator', '<=');
const GreaterEquals = token('operator', '>=');
const Add = token('operator', '+');
const Subtract = token('operator', '-');
const Multiply = token('operator', '*');
const Divide = token('operator', '/');
const Not = token('operator', '!');