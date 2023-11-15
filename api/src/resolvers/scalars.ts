import { GraphQLScalarType, Kind } from 'graphql'

export const DateTime = new GraphQLScalarType({
    name: 'DateTime',
    description: 'Represents a date time object',
    serialize(value) {
        if (value instanceof Date) {
            return value.toISOString(); // Convert outgoing Date to ISOString for JSON
        }
        throw new Error('DateTime cannot represent an invalid Date instance');
    },
    parseValue(value) {
        if (typeof value === 'string' || value instanceof Date) {
            return new Date(value); // Convert incoming string or Date to Date
        }
        throw new Error('DateTime cannot represent an invalid input');
    },
    parseLiteral(ast) {
        if (ast.kind === Kind.INT) {
            return new Date(parseInt(ast.value, 10)) // Convert hard-coded AST string to integer and then to Date
        }
        return null // Invalid hard-coded value (not an integer)
    },
})