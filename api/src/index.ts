import { PrismaClient } from "@prisma/client";
import { ApolloServer } from "apollo-server";
import { readFileSync } from 'fs';
import path from 'path';
import resolvers from './resolvers';

const orm = new PrismaClient()

const typeDefs = readFileSync(path.join(__dirname, 'schema.graphql'), 'utf8')

//server initializer
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) =>
    ({
        orm, user: req.headers['authorization']
    }),

})

server.listen().then(({ url }) => console.log(`server is running on ${url}`));

