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
  Unknown = 'UNKNOWN'
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
  registerUserFromExternalProvider: MeResponse;
  updateUserProfileImage?: Maybe<User>;
};


export type MutationAddConsentArgs = {
  type: ConsentType;
};


export type MutationRegisterArgs = {
  user?: Maybe<RegisterUserInput>;
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