import gql from 'graphql-tag';

export const schema = gql`
    enum GQLError {
        COGNITO_CREATION_FAILED
        INVALID_ARGUMENTS
        UNAUTHORISED
        USER_EXISTS
        INTERNAL_USER_CREATION_FAILED
        NO_INTERNAL_ID
    }
    
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
        role: Role!
        consents: [Consent!]
    }
    
    type MeResponse {
        me: User
    }
    
    input RegisterUserInput {
        email: String!
        password: String!
        firstName: String
        lastName: String
        bio: String
        role: Role!
    }

    input RegisterUserFromExternalProviderInput {
        firstName: String
        lastName: String
        bio: String
        role: Role!
    }
    
    type Query {
        me: MeResponse!
    }
    
    type Mutation {
        register(user: RegisterUserInput): Boolean
        registerUserFromExternalProvider(user: RegisterUserFromExternalProviderInput): User
    }
`;