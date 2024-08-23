
export const Query = {

    users: async (parent: any, args: any, { prisma }: any) => {
        const users = await prisma.user.findMany();
        return await prisma.user.findMany();
    },

    user: async (parent: any, { id }: any, { prisma }: any) => {
        return await prisma.user.findUnique({
            where: {
                id: parseInt(id)
            }
        });
    },

    posts: async (parent: any, args: any, { prisma }: any) => {
        return await prisma.post.findMany();
    },

    post: async (parent: any, { id }: any, { prisma }: any) => {
        return await prisma.post.findUnique({
            where: {
                id: parseInt(id)
            }
        });
    },

    me: async (parent: any, args: any, { prisma }: any) => {
        return await prisma.user.findUnique({
            where: {
                id: 1
            }
        });
    },
    profile: async (parent: any, args: any, { prisma }: any) => {
        return await prisma.profile.findUnique({
            where: {
                userId: parseInt(args.id)
            }
        });
    }
}