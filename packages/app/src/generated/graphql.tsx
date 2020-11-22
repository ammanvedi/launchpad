import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

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
  consentType: Scalars['String'];
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

export type RegisterUserInput = {
  email: Scalars['String'];
  password: Scalars['String'];
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  bio?: Maybe<Scalars['String']>;
  role: Role;
};

export type Query = {
  __typename?: 'Query';
  me: MeResponse;
};

export type Mutation = {
  __typename?: 'Mutation';
  register?: Maybe<Scalars['Boolean']>;
};


export type MutationRegisterArgs = {
  user?: Maybe<RegisterUserInput>;
};

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = (
  { __typename?: 'Query' }
  & { me: (
    { __typename?: 'MeResponse' }
    & { me?: Maybe<(
      { __typename?: 'User' }
      & GlobalUserFragmentFragment
    )> }
  ) }
);

export type GlobalUserFragmentFragment = (
  { __typename?: 'User' }
  & Pick<User, 'id' | 'firstName' | 'lastName' | 'bio' | 'role' | 'email' | 'profileImage'>
  & { consents?: Maybe<Array<(
    { __typename?: 'Consent' }
    & Pick<Consent, 'timestamp' | 'consentType'>
  )>> }
);

export type SignUpMutationVariables = Exact<{
  input?: Maybe<RegisterUserInput>;
}>;


export type SignUpMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'register'>
);

export const GlobalUserFragmentFragmentDoc = gql`
    fragment GlobalUserFragment on User {
  id
  firstName
  lastName
  bio
  role
  email
  profileImage
  bio
  role
  consents {
    timestamp
    consentType
  }
}
    `;
export const MeDocument = gql`
    query me {
  me {
    me {
      ...GlobalUserFragment
    }
  }
}
    ${GlobalUserFragmentFragmentDoc}`;

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
export const SignUpDocument = gql`
    mutation signUp($input: RegisterUserInput) {
  register(user: $input)
}
    `;
export type SignUpMutationFn = Apollo.MutationFunction<SignUpMutation, SignUpMutationVariables>;

/**
 * __useSignUpMutation__
 *
 * To run a mutation, you first call `useSignUpMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSignUpMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signUpMutation, { data, loading, error }] = useSignUpMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSignUpMutation(baseOptions?: Apollo.MutationHookOptions<SignUpMutation, SignUpMutationVariables>) {
        return Apollo.useMutation<SignUpMutation, SignUpMutationVariables>(SignUpDocument, baseOptions);
      }
export type SignUpMutationHookResult = ReturnType<typeof useSignUpMutation>;
export type SignUpMutationResult = Apollo.MutationResult<SignUpMutation>;
export type SignUpMutationOptions = Apollo.BaseMutationOptions<SignUpMutation, SignUpMutationVariables>;