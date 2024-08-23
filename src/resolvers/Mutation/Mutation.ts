import bcrypt from 'bcrypt';
import { jwtHelper } from "../../utils/iwtHelper";
import config from "../../config";


interface userInfo {
    name: string,
    email: string,
    password: string,
    bio?: string
}

export const Mutation = {
    createUser: async (parent: any, args: userInfo, { prisma }: any) => {

        const isExist = await prisma.user.findUnique({
            where: {
                email: args.email
            }
        });

        if (isExist) {
            return {
                token: null,
                userError: "User already exist"
            }
        }

        const hashedPassword = await bcrypt.hash(args.password, 10);
        const res = await prisma.user.create(
            {
                data: {
                    name: args.name,
                    email: args.email,
                    password: hashedPassword,
                }
            }
        );

        if (args.bio) {
            await prisma.profile.create({
                data: {
                    bio: args.bio,
                    userId: res.id
                }
            });
        }

        const token = await jwtHelper({
            userId: res.id
        }, config.jwt.secret as string
        );
        return {
            token,
            user: res
        };
    },

    login: async (parent: any, args: { email: string, password: string }, { prisma }: any) => {
        const user = await prisma.user.findUnique({
            where: {
                email: args.email
            }
        });

        if (!user) {
            return {
                token: null,
                userError: "User not found"
            }

        }

        const valid = await bcrypt.compare(args.password, user.password);
        if (!valid) {
            return {
                token: null,
                userError: "Invalid password"
            }
        }

        const token = await jwtHelper({
            userId: user.id
        }, config.jwt.secret as string
        );

        return {
            token,
            userError: null
        };
    }


}