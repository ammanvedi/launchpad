import gql from 'graphql-tag';

export const schema = gql`
    scalar Upload

    enum ConsentType {
        TERMS_OF_USE
        PRIVACY_POLICY
        COOKIES
        TRACKING
        ANALYTICS
    }

    enum GQLError {
        COGNITO_CREATION_FAILED
        INVALID_ARGUMENTS
        UNAUTHORISED
        USER_EXISTS
        INTERNAL_USER_CREATION_FAILED
        NO_INTERNAL_ID
        DB_ERROR
        USER_DOES_NOT_EXIST
        UPLOAD_FAILED
        ENTRY_EXISTS
        UNKNOWN
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
        consentedTo: ConsentType!
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

    type ConsentResponse {
        user: User
    }

    type HellowWorldData {
        hello: String
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
        helloWorld: HellowWorldData!
    }

    type Mutation {
        addConsent(type: ConsentType!): ConsentResponse
        register(user: RegisterUserInput): Boolean
        registerUserFromExternalProvider(
            user: RegisterUserFromExternalProviderInput
        ): User
        updateUserProfileImage(file: Upload!): User
    }
`;
