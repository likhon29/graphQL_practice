import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { resolvers } from './resolvers';
import { typeDefs } from './schema/schema';
import { Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from '@prisma/client/runtime/library';
const prisma = new PrismaClient();


interface Context {
    prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>;
}

const main = async () => {
    const server = new ApolloServer({
        typeDefs,
        resolvers,
    });

    const { url } = await startStandaloneServer(server, {
        listen: { port: 4000 },
        context: async ({ req }): Promise<Context> => {
            return {
                prisma
            }
        }
    });

    console.log(`🚀  Server ready at: ${url}`);
}

main();