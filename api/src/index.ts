import { ApolloServer } from "apollo-server";

//query
const typeDefs=`
    type Query{
        info:String!
    }
`
//resolvers
const resolvers={
    Query:{
        info:()=>'Api'
    }
}

//server initializer
const server = new ApolloServer({
    typeDefs,
    resolvers
}) 

server.listen().then(({url})=>console.log(`server is running on ${url}`));

console.log('hello platzi');
