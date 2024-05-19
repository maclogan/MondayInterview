import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { resolvers } from "./resolver/index.js";
import { typeDefs } from "./schema/index.js";
import 'dotenv/config';
const PORT = Number(process.env.PORT) || 4000;
const server = new ApolloServer({ resolvers, typeDefs });
const { url } = await startStandaloneServer(server, {
    listen: { port: PORT }
});
console.log(`Server ready at: ${url}`);
