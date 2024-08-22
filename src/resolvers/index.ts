import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { jwtHelper } from "../utils/iwtHelper";
import config from "../config";

const prisma = new PrismaClient();


interface userInfo {
    name: string,
    email: string,
    password: string,
    bio?: string
}


export const resolvers = {
    Query: {

        users: async (parent: any, args: any, { models }: any) => {
            const users = await prisma.user.findMany();
            console.log(users);
            return await prisma.user.findMany();
        },

        user: async (parent: any, { id }: any, { models }: any) => {
            return await prisma.user.findUnique({
                where: {
                    id: parseInt(id)
                }
            });
        },

        posts: async (parent: any, args: any, { models }: any) => {
            return await prisma.post.findMany();
        },

        post: async (parent: any, { id }: any, { models }: any) => {
            return await prisma.post.findUnique({
                where: {
                    id: parseInt(id)
                }
            });
        },

        me: async (parent: any, args: any, { models }: any) => {
            return await prisma.user.findUnique({
                where: {
                    id: 1
                }
            });
        }

    },

    Mutation: {
        createUser: async (parent: any, args: userInfo, { models }: any) => {

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

            const token = await jwtHelper({
                userId: res.id
            }, config.jwt.secret as string
            );
            return {
                token,
                user: res
            };
        },

        login: async (parent: any, args: { email: string, password: string }, { models }: any) => {
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
}