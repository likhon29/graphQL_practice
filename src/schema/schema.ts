
export const typeDefs = `
    type Query {
        users: [User]
        user(id: ID!): User
        posts: [Post]
        post(id: ID!): Post
        me: User
        profile(id: ID!): Profile
    }

    type Mutation {
        createUser(
            name: String!
            email: String!
            password: String!
            bio: String
        ): AuthPayload

        login(
            email: String!
            password: String!
        ): AuthPayload
    }
   
    type AuthPayload {
        token: String
        userError: String
    }

    type Post {
        id: ID!
        title: String!
        content: String!
        published: Boolean!
        author: User
        createdAt: String! 
        updatedAt: String! 
    }

    type User {
        id: ID!
        name: String!
        email: String!
        posts: [Post]
        createdAt: String!  
    }

    type Profile{
        id: ID!
        bio: String
        createdAt: String!
        user: User!
    }

   
`;

