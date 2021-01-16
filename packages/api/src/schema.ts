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
        USERNAME_OR_PASSWORD_INCORRECT
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
        tokensExpireAtUtcSecs: Int!
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
        signIn(username: String!, password: String!): User!

        verifyEmailBegin(username: String!): Boolean
        verifyEmailComplete(code: String!): Boolean

        forgotPasswordBegin(username: String!): Boolean
        forgotPasswordComplete(
            code: String!
            newPassword: String!
            username: String!
        ): Boolean

        setPasswordComple(password: String!): Boolean

        changeEmailBegin(newEmail: String!): Boolean
        changeEmailComplete(code: String!): Boolean

        registerUserFromExternalProvider(
            user: RegisterUserFromExternalProviderInput
        ): MeResponse!
        updateUserProfileImage(file: Upload!): User
    }
`;
