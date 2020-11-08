import gql from 'graphql-tag';

export const schema = gql`
    enum Role {
        USER
        DESIGNER
        MANUFACTURER
        DESIGNER_MANUFACTURER
        PARTNER
    }
    
    type Consent {
        id: ID!
        timestamp: String!
        consentType: String!
    }

    type User {
        id: ID!
        email: String!
        firstName: String
        lastName: String
        profileImage: String
        bio: String
        role: Role
        consents: [Consent!]
    }
    
    input RegisterUserInput {
        id: String!
        firstName: String
        lastName: String
        bio: String
        role: Role
    }
    
    type Query {
        me: User
    }
    
    type Mutation {
        register(user: RegisterUserInput): User
    }
`;