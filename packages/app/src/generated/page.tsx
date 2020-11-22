import * as Types from './graphql';

import * as Operations from './graphql';
import { NextPage } from 'next';
import { NextRouter, useRouter } from 'next/router'
import { QueryHookOptions, useQuery } from '@apollo/client';
import * as Apollo from '@apollo/client';
import React from 'react';
import { getApolloClient} from '../lib/apollo';
export async function getServerPageMe
    (options: Omit<Apollo.QueryOptions<Types.MeQueryVariables>, 'query'>, ctx? :any ){
        const apolloClient = getApolloClient(ctx);
        
        const data = await apolloClient.query<Types.MeQuery>({ ...options, query:Operations.MeDocument });
        
        const apolloState = apolloClient.cache.extract();

        return {
            props: {
                apolloState,
                data: data?.data,
                error: data?.error ?? data?.errors ?? null,
            },
        };
      }
export const useMe = (
  optionsFunc?: (router: NextRouter)=> QueryHookOptions<Types.MeQuery, Types.MeQueryVariables>) => {
  const router = useRouter();
  const options = optionsFunc ? optionsFunc(router) : {};
  return useQuery(Operations.MeDocument, options);
};
export type PageMeComp = React.FC<{data?: Types.MeQuery, error?: Apollo.ApolloError}>;
export const withPageMe = (optionsFunc?: (router: NextRouter)=> QueryHookOptions<Types.MeQuery, Types.MeQueryVariables>) => (WrappedComponent:PageMeComp) : NextPage  => (props) => {
                const router = useRouter()
                const options = optionsFunc ? optionsFunc(router) : {};
                const {data, error } = useQuery(Operations.MeDocument, options)    
                return <WrappedComponent {...props} data={data} error={error} /> ;
                   
            }; 
export const ssrMe = {
      getServerPage: getServerPageMe,
      withPage: withPageMe,
      usePage: useMe,
    }
export async function getServerPageSignUp
    (options: Omit<Apollo.QueryOptions<Types.SignUpMutationVariables>, 'query'>, ctx? :any ){
        const apolloClient = getApolloClient(ctx);
        
        const data = await apolloClient.query<Types.SignUpMutation>({ ...options, query:Operations.SignUpDocument });
        
        const apolloState = apolloClient.cache.extract();

        return {
            props: {
                apolloState,
                data: data?.data,
                error: data?.error ?? data?.errors ?? null,
            },
        };
      }
export const useSignUp = (
  optionsFunc?: (router: NextRouter)=> QueryHookOptions<Types.SignUpMutation, Types.SignUpMutationVariables>) => {
  const router = useRouter();
  const options = optionsFunc ? optionsFunc(router) : {};
  return useQuery(Operations.SignUpDocument, options);
};
export type PageSignUpComp = React.FC<{data?: Types.SignUpMutation, error?: Apollo.ApolloError}>;
export const withPageSignUp = (optionsFunc?: (router: NextRouter)=> QueryHookOptions<Types.SignUpMutation, Types.SignUpMutationVariables>) => (WrappedComponent:PageSignUpComp) : NextPage  => (props) => {
                const router = useRouter()
                const options = optionsFunc ? optionsFunc(router) : {};
                const {data, error } = useQuery(Operations.SignUpDocument, options)    
                return <WrappedComponent {...props} data={data} error={error} /> ;
                   
            }; 
export const ssrSignUp = {
      getServerPage: getServerPageSignUp,
      withPage: withPageSignUp,
      usePage: useSignUp,
    }