import { PrismaClient } from "@prisma/client";
import { ApolloServer } from "apollo-server";
import { readFileSync } from 'fs';
import path from 'path';
import resolvers from './resolvers';

const orm = new PrismaClient

const typeDefs = readFileSync(path.join(__dirname, 'schema.graphql'), 'utf8')
//query
// const typeDefs = `
//     type Query{
//         info:String!
//     }
// `
// //resolvers
// const resolvers = {
//     Query: {
//         info: () => 'Api'
//     }
// }

//server initializer
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: {
        orm
    }
})

server.listen().then(({ url }) => console.log(`server is running on ${url}`));

