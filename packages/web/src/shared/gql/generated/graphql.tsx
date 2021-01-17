import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Upload: any;
};


export enum ConsentType {
  TermsOfUse = 'TERMS_OF_USE',
  PrivacyPolicy = 'PRIVACY_POLICY',
  Cookies = 'COOKIES',
  Tracking = 'TRACKING',
  Analytics = 'ANALYTICS'
}

export enum GqlError {
  CognitoCreationFailed = 'COGNITO_CREATION_FAILED',
  InvalidArguments = 'INVALID_ARGUMENTS',
  Unauthorised = 'UNAUTHORISED',
  UserExists = 'USER_EXISTS',
  InternalUserCreationFailed = 'INTERNAL_USER_CREATION_FAILED',
  NoInternalId = 'NO_INTERNAL_ID',
  DbError = 'DB_ERROR',
  UserDoesNotExist = 'USER_DOES_NOT_EXIST',
  UploadFailed = 'UPLOAD_FAILED',
  EntryExists = 'ENTRY_EXISTS',
  Unknown = 'UNKNOWN',
  UsernameOrPasswordIncorrect = 'USERNAME_OR_PASSWORD_INCORRECT',
  TokensMissing = 'TOKENS_MISSING',
  VerificationCodeError = 'VERIFICATION_CODE_ERROR'
}

export enum Role {
  User = 'USER',
  Designer = 'DESIGNER',
  Manufacturer = 'MANUFACTURER',
  DesignerManufacturer = 'DESIGNER_MANUFACTURER',
  Partner = 'PARTNER'
}

export type Consent = {
  __typename?: 'Consent';
  id: Scalars['ID'];
  timestamp: Scalars['String'];
  consentedTo: ConsentType;
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  email: Scalars['String'];
  tokensExpireAtUtcSecs: Scalars['Int'];
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  profileImage?: Maybe<Scalars['String']>;
  bio?: Maybe<Scalars['String']>;
  role: Role;
  consents?: Maybe<Array<Consent>>;
};

export type MeResponse = {
  __typename?: 'MeResponse';
  me?: Maybe<User>;
};

export type ConsentResponse = {
  __typename?: 'ConsentResponse';
  user?: Maybe<User>;
};

export type HellowWorldData = {
  __typename?: 'HellowWorldData';
  hello?: Maybe<Scalars['String']>;
};

export type RegisterUserInput = {
  email: Scalars['String'];
  password: Scalars['String'];
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  bio?: Maybe<Scalars['String']>;
  role: Role;
};

export type RegisterUserFromExternalProviderInput = {
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  bio?: Maybe<Scalars['String']>;
  role: Role;
};

export type Query = {
  __typename?: 'Query';
  me: MeResponse;
  helloWorld: HellowWorldData;
};

export type Mutation = {
  __typename?: 'Mutation';
  addConsent?: Maybe<ConsentResponse>;
  register?: Maybe<Scalars['Boolean']>;
  signIn: User;
  signOut?: Maybe<Scalars['Boolean']>;
  registerResendVerificationEmail?: Maybe<Scalars['Boolean']>;
  registerVerifyEmail?: Maybe<Scalars['Boolean']>;
  forgotPasswordBegin?: Maybe<Scalars['Boolean']>;
  forgotPasswordComplete?: Maybe<Scalars['Boolean']>;
  setPasswordComplete?: Maybe<Scalars['Boolean']>;
  changeEmailBegin?: Maybe<Scalars['Boolean']>;
  changeEmailComplete?: Maybe<Scalars['Boolean']>;
  refreshTokens?: Maybe<Scalars['Boolean']>;
  registerUserFromExternalProvider: MeResponse;
  updateUserProfileImage?: Maybe<User>;
};


export type MutationAddConsentArgs = {
  type: ConsentType;
};


export type MutationRegisterArgs = {
  user?: Maybe<RegisterUserInput>;
};


export type MutationSignInArgs = {
  username: Scalars['String'];
  password: Scalars['String'];
};


export type MutationSignOutArgs = {
  global?: Maybe<Scalars['Boolean']>;
};


export type MutationRegisterResendVerificationEmailArgs = {
  username: Scalars['String'];
};


export type MutationRegisterVerifyEmailArgs = {
  username: Scalars['String'];
  code: Scalars['String'];
};


export type MutationForgotPasswordBeginArgs = {
  username: Scalars['String'];
};


export type MutationForgotPasswordCompleteArgs = {
  code: Scalars['String'];
  newPassword: Scalars['String'];
  username: Scalars['String'];
};


export type MutationSetPasswordCompleteArgs = {
  currentPassword: Scalars['String'];
  password: Scalars['String'];
};


export type MutationChangeEmailBeginArgs = {
  newEmail: Scalars['String'];
};


export type MutationChangeEmailCompleteArgs = {
  code: Scalars['String'];
};


export type MutationRegisterUserFromExternalProviderArgs = {
  user?: Maybe<RegisterUserFromExternalProviderInput>;
};


export type MutationUpdateUserProfileImageArgs = {
  file: Scalars['Upload'];
};

export type GlobalConsentsFragmentFragment = (
  { __typename?: 'Consent' }
  & Pick<Consent, 'id' | 'consentedTo'>
);

export type GlobalMeFragmentFragment = (
  { __typename?: 'User' }
  & Pick<User, 'id' | 'firstName' | 'lastName' | 'profileImage'>
  & { consents?: Maybe<Array<(
    { __typename?: 'Consent' }
    & GlobalConsentsFragmentFragment
  )>> }
);

export type ChangeEmailBeginMutationVariables = Exact<{
  newEmail: Scalars['String'];
}>;


export type ChangeEmailBeginMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'changeEmailBegin'>
);

export type ChangeEmailCompleteMutationVariables = Exact<{
  code: Scalars['String'];
}>;


export type ChangeEmailCompleteMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'changeEmailComplete'>
);

export type AddConsentMutationVariables = Exact<{
  type: ConsentType;
}>;


export type AddConsentMutation = (
  { __typename?: 'Mutation' }
  & { addConsent?: Maybe<(
    { __typename?: 'ConsentResponse' }
    & { user?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'id'>
      & { consents?: Maybe<Array<(
        { __typename?: 'Consent' }
        & GlobalConsentsFragmentFragment
      )>> }
    )> }
  )> }
);

export type ForgotPasswordBeginMutationVariables = Exact<{
  username: Scalars['String'];
}>;


export type ForgotPasswordBeginMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'forgotPasswordBegin'>
);

export type ForgotPasswordCompleteMutationVariables = Exact<{
  code: Scalars['String'];
  newPassword: Scalars['String'];
  username: Scalars['String'];
}>;


export type ForgotPasswordCompleteMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'forgotPasswordComplete'>
);

export type RefreshTokensMutationVariables = Exact<{ [key: string]: never; }>;


export type RefreshTokensMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'refreshTokens'>
);

export type RegisterResendVerificationEmailMutationVariables = Exact<{
  username: Scalars['String'];
}>;


export type RegisterResendVerificationEmailMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'registerResendVerificationEmail'>
);

export type RegisterVerifyEmailMutationVariables = Exact<{
  username: Scalars['String'];
  code: Scalars['String'];
}>;


export type RegisterVerifyEmailMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'registerVerifyEmail'>
);

export type RegisterExternalUserMutationVariables = Exact<{
  user?: Maybe<RegisterUserFromExternalProviderInput>;
}>;


export type RegisterExternalUserMutation = (
  { __typename?: 'Mutation' }
  & { registerUserFromExternalProvider: (
    { __typename?: 'MeResponse' }
    & { me?: Maybe<(
      { __typename?: 'User' }
      & GlobalMeFragmentFragment
    )> }
  ) }
);

export type RegisterMutationVariables = Exact<{
  input?: Maybe<RegisterUserInput>;
}>;


export type RegisterMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'register'>
);

export type SetPasswordCompleteMutationVariables = Exact<{
  currentPassword: Scalars['String'];
  password: Scalars['String'];
}>;


export type SetPasswordCompleteMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'setPasswordComplete'>
);

export type SignInMutationVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
}>;


export type SignInMutation = (
  { __typename?: 'Mutation' }
  & { signIn: (
    { __typename?: 'User' }
    & GlobalMeFragmentFragment
  ) }
);

export type SignOutMutationVariables = Exact<{
  global?: Maybe<Scalars['Boolean']>;
}>;


export type SignOutMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'signOut'>
);

export type UploadUserProfileImageMutationVariables = Exact<{
  file: Scalars['Upload'];
}>;


export type UploadUserProfileImageMutation = (
  { __typename?: 'Mutation' }
  & { updateUserProfileImage?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'profileImage'>
  )> }
);

export type HelloQueryVariables = Exact<{ [key: string]: never; }>;


export type HelloQuery = (
  { __typename?: 'Query' }
  & { helloWorld: (
    { __typename?: 'HellowWorldData' }
    & Pick<HellowWorldData, 'hello'>
  ) }
);

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = (
  { __typename?: 'Query' }
  & { me: (
    { __typename?: 'MeResponse' }
    & { me?: Maybe<(
      { __typename?: 'User' }
      & GlobalMeFragmentFragment
    )> }
  ) }
);

export const GlobalConsentsFragmentFragmentDoc = gql`
    fragment GlobalConsentsFragment on Consent {
  id
  consentedTo
}
    `;
export const GlobalMeFragmentFragmentDoc = gql`
    fragment GlobalMeFragment on User {
  id
  firstName
  lastName
  profileImage
  consents {
    ...GlobalConsentsFragment
  }
}
    ${GlobalConsentsFragmentFragmentDoc}`;
export const ChangeEmailBeginDocument = gql`
    mutation changeEmailBegin($newEmail: String!) {
  changeEmailBegin(newEmail: $newEmail)
}
    `;
export type ChangeEmailBeginMutationFn = Apollo.MutationFunction<ChangeEmailBeginMutation, ChangeEmailBeginMutationVariables>;

/**
 * __useChangeEmailBeginMutation__
 *
 * To run a mutation, you first call `useChangeEmailBeginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangeEmailBeginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changeEmailBeginMutation, { data, loading, error }] = useChangeEmailBeginMutation({
 *   variables: {
 *      newEmail: // value for 'newEmail'
 *   },
 * });
 */
export function useChangeEmailBeginMutation(baseOptions?: Apollo.MutationHookOptions<ChangeEmailBeginMutation, ChangeEmailBeginMutationVariables>) {
        return Apollo.useMutation<ChangeEmailBeginMutation, ChangeEmailBeginMutationVariables>(ChangeEmailBeginDocument, baseOptions);
      }
export type ChangeEmailBeginMutationHookResult = ReturnType<typeof useChangeEmailBeginMutation>;
export type ChangeEmailBeginMutationResult = Apollo.MutationResult<ChangeEmailBeginMutation>;
export type ChangeEmailBeginMutationOptions = Apollo.BaseMutationOptions<ChangeEmailBeginMutation, ChangeEmailBeginMutationVariables>;
export const ChangeEmailCompleteDocument = gql`
    mutation changeEmailComplete($code: String!) {
  changeEmailComplete(code: $code)
}
    `;
export type ChangeEmailCompleteMutationFn = Apollo.MutationFunction<ChangeEmailCompleteMutation, ChangeEmailCompleteMutationVariables>;

/**
 * __useChangeEmailCompleteMutation__
 *
 * To run a mutation, you first call `useChangeEmailCompleteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangeEmailCompleteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changeEmailCompleteMutation, { data, loading, error }] = useChangeEmailCompleteMutation({
 *   variables: {
 *      code: // value for 'code'
 *   },
 * });
 */
export function useChangeEmailCompleteMutation(baseOptions?: Apollo.MutationHookOptions<ChangeEmailCompleteMutation, ChangeEmailCompleteMutationVariables>) {
        return Apollo.useMutation<ChangeEmailCompleteMutation, ChangeEmailCompleteMutationVariables>(ChangeEmailCompleteDocument, baseOptions);
      }
export type ChangeEmailCompleteMutationHookResult = ReturnType<typeof useChangeEmailCompleteMutation>;
export type ChangeEmailCompleteMutationResult = Apollo.MutationResult<ChangeEmailCompleteMutation>;
export type ChangeEmailCompleteMutationOptions = Apollo.BaseMutationOptions<ChangeEmailCompleteMutation, ChangeEmailCompleteMutationVariables>;
export const AddConsentDocument = gql`
    mutation addConsent($type: ConsentType!) {
  addConsent(type: $type) {
    user {
      id
      consents {
        ...GlobalConsentsFragment
      }
    }
  }
}
    ${GlobalConsentsFragmentFragmentDoc}`;
export type AddConsentMutationFn = Apollo.MutationFunction<AddConsentMutation, AddConsentMutationVariables>;

/**
 * __useAddConsentMutation__
 *
 * To run a mutation, you first call `useAddConsentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddConsentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addConsentMutation, { data, loading, error }] = useAddConsentMutation({
 *   variables: {
 *      type: // value for 'type'
 *   },
 * });
 */
export function useAddConsentMutation(baseOptions?: Apollo.MutationHookOptions<AddConsentMutation, AddConsentMutationVariables>) {
        return Apollo.useMutation<AddConsentMutation, AddConsentMutationVariables>(AddConsentDocument, baseOptions);
      }
export type AddConsentMutationHookResult = ReturnType<typeof useAddConsentMutation>;
export type AddConsentMutationResult = Apollo.MutationResult<AddConsentMutation>;
export type AddConsentMutationOptions = Apollo.BaseMutationOptions<AddConsentMutation, AddConsentMutationVariables>;
export const ForgotPasswordBeginDocument = gql`
    mutation forgotPasswordBegin($username: String!) {
  forgotPasswordBegin(username: $username)
}
    `;
export type ForgotPasswordBeginMutationFn = Apollo.MutationFunction<ForgotPasswordBeginMutation, ForgotPasswordBeginMutationVariables>;

/**
 * __useForgotPasswordBeginMutation__
 *
 * To run a mutation, you first call `useForgotPasswordBeginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useForgotPasswordBeginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [forgotPasswordBeginMutation, { data, loading, error }] = useForgotPasswordBeginMutation({
 *   variables: {
 *      username: // value for 'username'
 *   },
 * });
 */
export function useForgotPasswordBeginMutation(baseOptions?: Apollo.MutationHookOptions<ForgotPasswordBeginMutation, ForgotPasswordBeginMutationVariables>) {
        return Apollo.useMutation<ForgotPasswordBeginMutation, ForgotPasswordBeginMutationVariables>(ForgotPasswordBeginDocument, baseOptions);
      }
export type ForgotPasswordBeginMutationHookResult = ReturnType<typeof useForgotPasswordBeginMutation>;
export type ForgotPasswordBeginMutationResult = Apollo.MutationResult<ForgotPasswordBeginMutation>;
export type ForgotPasswordBeginMutationOptions = Apollo.BaseMutationOptions<ForgotPasswordBeginMutation, ForgotPasswordBeginMutationVariables>;
export const ForgotPasswordCompleteDocument = gql`
    mutation forgotPasswordComplete($code: String!, $newPassword: String!, $username: String!) {
  forgotPasswordComplete(
    username: $username
    code: $code
    newPassword: $newPassword
  )
}
    `;
export type ForgotPasswordCompleteMutationFn = Apollo.MutationFunction<ForgotPasswordCompleteMutation, ForgotPasswordCompleteMutationVariables>;

/**
 * __useForgotPasswordCompleteMutation__
 *
 * To run a mutation, you first call `useForgotPasswordCompleteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useForgotPasswordCompleteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [forgotPasswordCompleteMutation, { data, loading, error }] = useForgotPasswordCompleteMutation({
 *   variables: {
 *      code: // value for 'code'
 *      newPassword: // value for 'newPassword'
 *      username: // value for 'username'
 *   },
 * });
 */
export function useForgotPasswordCompleteMutation(baseOptions?: Apollo.MutationHookOptions<ForgotPasswordCompleteMutation, ForgotPasswordCompleteMutationVariables>) {
        return Apollo.useMutation<ForgotPasswordCompleteMutation, ForgotPasswordCompleteMutationVariables>(ForgotPasswordCompleteDocument, baseOptions);
      }
export type ForgotPasswordCompleteMutationHookResult = ReturnType<typeof useForgotPasswordCompleteMutation>;
export type ForgotPasswordCompleteMutationResult = Apollo.MutationResult<ForgotPasswordCompleteMutation>;
export type ForgotPasswordCompleteMutationOptions = Apollo.BaseMutationOptions<ForgotPasswordCompleteMutation, ForgotPasswordCompleteMutationVariables>;
export const RefreshTokensDocument = gql`
    mutation refreshTokens {
  refreshTokens
}
    `;
export type RefreshTokensMutationFn = Apollo.MutationFunction<RefreshTokensMutation, RefreshTokensMutationVariables>;

/**
 * __useRefreshTokensMutation__
 *
 * To run a mutation, you first call `useRefreshTokensMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRefreshTokensMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [refreshTokensMutation, { data, loading, error }] = useRefreshTokensMutation({
 *   variables: {
 *   },
 * });
 */
export function useRefreshTokensMutation(baseOptions?: Apollo.MutationHookOptions<RefreshTokensMutation, RefreshTokensMutationVariables>) {
        return Apollo.useMutation<RefreshTokensMutation, RefreshTokensMutationVariables>(RefreshTokensDocument, baseOptions);
      }
export type RefreshTokensMutationHookResult = ReturnType<typeof useRefreshTokensMutation>;
export type RefreshTokensMutationResult = Apollo.MutationResult<RefreshTokensMutation>;
export type RefreshTokensMutationOptions = Apollo.BaseMutationOptions<RefreshTokensMutation, RefreshTokensMutationVariables>;
export const RegisterResendVerificationEmailDocument = gql`
    mutation registerResendVerificationEmail($username: String!) {
  registerResendVerificationEmail(username: $username)
}
    `;
export type RegisterResendVerificationEmailMutationFn = Apollo.MutationFunction<RegisterResendVerificationEmailMutation, RegisterResendVerificationEmailMutationVariables>;

/**
 * __useRegisterResendVerificationEmailMutation__
 *
 * To run a mutation, you first call `useRegisterResendVerificationEmailMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterResendVerificationEmailMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerResendVerificationEmailMutation, { data, loading, error }] = useRegisterResendVerificationEmailMutation({
 *   variables: {
 *      username: // value for 'username'
 *   },
 * });
 */
export function useRegisterResendVerificationEmailMutation(baseOptions?: Apollo.MutationHookOptions<RegisterResendVerificationEmailMutation, RegisterResendVerificationEmailMutationVariables>) {
        return Apollo.useMutation<RegisterResendVerificationEmailMutation, RegisterResendVerificationEmailMutationVariables>(RegisterResendVerificationEmailDocument, baseOptions);
      }
export type RegisterResendVerificationEmailMutationHookResult = ReturnType<typeof useRegisterResendVerificationEmailMutation>;
export type RegisterResendVerificationEmailMutationResult = Apollo.MutationResult<RegisterResendVerificationEmailMutation>;
export type RegisterResendVerificationEmailMutationOptions = Apollo.BaseMutationOptions<RegisterResendVerificationEmailMutation, RegisterResendVerificationEmailMutationVariables>;
export const RegisterVerifyEmailDocument = gql`
    mutation registerVerifyEmail($username: String!, $code: String!) {
  registerVerifyEmail(username: $username, code: $code)
}
    `;
export type RegisterVerifyEmailMutationFn = Apollo.MutationFunction<RegisterVerifyEmailMutation, RegisterVerifyEmailMutationVariables>;

/**
 * __useRegisterVerifyEmailMutation__
 *
 * To run a mutation, you first call `useRegisterVerifyEmailMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterVerifyEmailMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerVerifyEmailMutation, { data, loading, error }] = useRegisterVerifyEmailMutation({
 *   variables: {
 *      username: // value for 'username'
 *      code: // value for 'code'
 *   },
 * });
 */
export function useRegisterVerifyEmailMutation(baseOptions?: Apollo.MutationHookOptions<RegisterVerifyEmailMutation, RegisterVerifyEmailMutationVariables>) {
        return Apollo.useMutation<RegisterVerifyEmailMutation, RegisterVerifyEmailMutationVariables>(RegisterVerifyEmailDocument, baseOptions);
      }
export type RegisterVerifyEmailMutationHookResult = ReturnType<typeof useRegisterVerifyEmailMutation>;
export type RegisterVerifyEmailMutationResult = Apollo.MutationResult<RegisterVerifyEmailMutation>;
export type RegisterVerifyEmailMutationOptions = Apollo.BaseMutationOptions<RegisterVerifyEmailMutation, RegisterVerifyEmailMutationVariables>;
export const RegisterExternalUserDocument = gql`
    mutation registerExternalUser($user: RegisterUserFromExternalProviderInput) {
  registerUserFromExternalProvider(user: $user) {
    me {
      ...GlobalMeFragment
    }
  }
}
    ${GlobalMeFragmentFragmentDoc}`;
export type RegisterExternalUserMutationFn = Apollo.MutationFunction<RegisterExternalUserMutation, RegisterExternalUserMutationVariables>;

/**
 * __useRegisterExternalUserMutation__
 *
 * To run a mutation, you first call `useRegisterExternalUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterExternalUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerExternalUserMutation, { data, loading, error }] = useRegisterExternalUserMutation({
 *   variables: {
 *      user: // value for 'user'
 *   },
 * });
 */
export function useRegisterExternalUserMutation(baseOptions?: Apollo.MutationHookOptions<RegisterExternalUserMutation, RegisterExternalUserMutationVariables>) {
        return Apollo.useMutation<RegisterExternalUserMutation, RegisterExternalUserMutationVariables>(RegisterExternalUserDocument, baseOptions);
      }
export type RegisterExternalUserMutationHookResult = ReturnType<typeof useRegisterExternalUserMutation>;
export type RegisterExternalUserMutationResult = Apollo.MutationResult<RegisterExternalUserMutation>;
export type RegisterExternalUserMutationOptions = Apollo.BaseMutationOptions<RegisterExternalUserMutation, RegisterExternalUserMutationVariables>;
export const RegisterDocument = gql`
    mutation register($input: RegisterUserInput) {
  register(user: $input)
}
    `;
export type RegisterMutationFn = Apollo.MutationFunction<RegisterMutation, RegisterMutationVariables>;

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRegisterMutation(baseOptions?: Apollo.MutationHookOptions<RegisterMutation, RegisterMutationVariables>) {
        return Apollo.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument, baseOptions);
      }
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = Apollo.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = Apollo.BaseMutationOptions<RegisterMutation, RegisterMutationVariables>;
export const SetPasswordCompleteDocument = gql`
    mutation setPasswordComplete($currentPassword: String!, $password: String!) {
  setPasswordComplete(password: $password, currentPassword: $currentPassword)
}
    `;
export type SetPasswordCompleteMutationFn = Apollo.MutationFunction<SetPasswordCompleteMutation, SetPasswordCompleteMutationVariables>;

/**
 * __useSetPasswordCompleteMutation__
 *
 * To run a mutation, you first call `useSetPasswordCompleteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetPasswordCompleteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setPasswordCompleteMutation, { data, loading, error }] = useSetPasswordCompleteMutation({
 *   variables: {
 *      currentPassword: // value for 'currentPassword'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useSetPasswordCompleteMutation(baseOptions?: Apollo.MutationHookOptions<SetPasswordCompleteMutation, SetPasswordCompleteMutationVariables>) {
        return Apollo.useMutation<SetPasswordCompleteMutation, SetPasswordCompleteMutationVariables>(SetPasswordCompleteDocument, baseOptions);
      }
export type SetPasswordCompleteMutationHookResult = ReturnType<typeof useSetPasswordCompleteMutation>;
export type SetPasswordCompleteMutationResult = Apollo.MutationResult<SetPasswordCompleteMutation>;
export type SetPasswordCompleteMutationOptions = Apollo.BaseMutationOptions<SetPasswordCompleteMutation, SetPasswordCompleteMutationVariables>;
export const SignInDocument = gql`
    mutation signIn($username: String!, $password: String!) {
  signIn(password: $password, username: $username) {
    ...GlobalMeFragment
  }
}
    ${GlobalMeFragmentFragmentDoc}`;
export type SignInMutationFn = Apollo.MutationFunction<SignInMutation, SignInMutationVariables>;

/**
 * __useSignInMutation__
 *
 * To run a mutation, you first call `useSignInMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSignInMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signInMutation, { data, loading, error }] = useSignInMutation({
 *   variables: {
 *      username: // value for 'username'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useSignInMutation(baseOptions?: Apollo.MutationHookOptions<SignInMutation, SignInMutationVariables>) {
        return Apollo.useMutation<SignInMutation, SignInMutationVariables>(SignInDocument, baseOptions);
      }
export type SignInMutationHookResult = ReturnType<typeof useSignInMutation>;
export type SignInMutationResult = Apollo.MutationResult<SignInMutation>;
export type SignInMutationOptions = Apollo.BaseMutationOptions<SignInMutation, SignInMutationVariables>;
export const SignOutDocument = gql`
    mutation signOut($global: Boolean) {
  signOut(global: $global)
}
    `;
export type SignOutMutationFn = Apollo.MutationFunction<SignOutMutation, SignOutMutationVariables>;

/**
 * __useSignOutMutation__
 *
 * To run a mutation, you first call `useSignOutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSignOutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signOutMutation, { data, loading, error }] = useSignOutMutation({
 *   variables: {
 *      global: // value for 'global'
 *   },
 * });
 */
export function useSignOutMutation(baseOptions?: Apollo.MutationHookOptions<SignOutMutation, SignOutMutationVariables>) {
        return Apollo.useMutation<SignOutMutation, SignOutMutationVariables>(SignOutDocument, baseOptions);
      }
export type SignOutMutationHookResult = ReturnType<typeof useSignOutMutation>;
export type SignOutMutationResult = Apollo.MutationResult<SignOutMutation>;
export type SignOutMutationOptions = Apollo.BaseMutationOptions<SignOutMutation, SignOutMutationVariables>;
export const UploadUserProfileImageDocument = gql`
    mutation uploadUserProfileImage($file: Upload!) {
  updateUserProfileImage(file: $file) {
    id
    profileImage
  }
}
    `;
export type UploadUserProfileImageMutationFn = Apollo.MutationFunction<UploadUserProfileImageMutation, UploadUserProfileImageMutationVariables>;

/**
 * __useUploadUserProfileImageMutation__
 *
 * To run a mutation, you first call `useUploadUserProfileImageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUploadUserProfileImageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [uploadUserProfileImageMutation, { data, loading, error }] = useUploadUserProfileImageMutation({
 *   variables: {
 *      file: // value for 'file'
 *   },
 * });
 */
export function useUploadUserProfileImageMutation(baseOptions?: Apollo.MutationHookOptions<UploadUserProfileImageMutation, UploadUserProfileImageMutationVariables>) {
        return Apollo.useMutation<UploadUserProfileImageMutation, UploadUserProfileImageMutationVariables>(UploadUserProfileImageDocument, baseOptions);
      }
export type UploadUserProfileImageMutationHookResult = ReturnType<typeof useUploadUserProfileImageMutation>;
export type UploadUserProfileImageMutationResult = Apollo.MutationResult<UploadUserProfileImageMutation>;
export type UploadUserProfileImageMutationOptions = Apollo.BaseMutationOptions<UploadUserProfileImageMutation, UploadUserProfileImageMutationVariables>;
export const HelloDocument = gql`
    query hello {
  helloWorld {
    hello
  }
}
    `;

/**
 * __useHelloQuery__
 *
 * To run a query within a React component, call `useHelloQuery` and pass it any options that fit your needs.
 * When your component renders, `useHelloQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useHelloQuery({
 *   variables: {
 *   },
 * });
 */
export function useHelloQuery(baseOptions?: Apollo.QueryHookOptions<HelloQuery, HelloQueryVariables>) {
        return Apollo.useQuery<HelloQuery, HelloQueryVariables>(HelloDocument, baseOptions);
      }
export function useHelloLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<HelloQuery, HelloQueryVariables>) {
          return Apollo.useLazyQuery<HelloQuery, HelloQueryVariables>(HelloDocument, baseOptions);
        }
export type HelloQueryHookResult = ReturnType<typeof useHelloQuery>;
export type HelloLazyQueryHookResult = ReturnType<typeof useHelloLazyQuery>;
export type HelloQueryResult = Apollo.QueryResult<HelloQuery, HelloQueryVariables>;
export const MeDocument = gql`
    query me {
  me {
    me {
      ...GlobalMeFragment
    }
  }
}
    ${GlobalMeFragmentFragmentDoc}`;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, baseOptions);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, baseOptions);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;