import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
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
  registerUserFromExternalProvider?: Maybe<User>;
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



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> = LegacyStitchingResolver<TResult, TParent, TContext, TArgs> | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Upload: ResolverTypeWrapper<Scalars['Upload']>;
  ConsentType: ConsentType;
  GQLError: GqlError;
  Role: Role;
  Consent: ResolverTypeWrapper<Consent>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  String: ResolverTypeWrapper<Scalars['String']>;
  User: ResolverTypeWrapper<User>;
  MeResponse: ResolverTypeWrapper<MeResponse>;
  ConsentResponse: ResolverTypeWrapper<ConsentResponse>;
  HellowWorldData: ResolverTypeWrapper<HellowWorldData>;
  RegisterUserInput: RegisterUserInput;
  RegisterUserFromExternalProviderInput: RegisterUserFromExternalProviderInput;
  Query: ResolverTypeWrapper<{}>;
  Mutation: ResolverTypeWrapper<{}>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Upload: Scalars['Upload'];
  Consent: Consent;
  ID: Scalars['ID'];
  String: Scalars['String'];
  User: User;
  MeResponse: MeResponse;
  ConsentResponse: ConsentResponse;
  HellowWorldData: HellowWorldData;
  RegisterUserInput: RegisterUserInput;
  RegisterUserFromExternalProviderInput: RegisterUserFromExternalProviderInput;
  Query: {};
  Mutation: {};
  Boolean: Scalars['Boolean'];
};

export interface UploadScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Upload'], any> {
  name: 'Upload';
}

export type ConsentResolvers<ContextType = any, ParentType extends ResolversParentTypes['Consent'] = ResolversParentTypes['Consent']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  consentedTo?: Resolver<ResolversTypes['ConsentType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  firstName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  lastName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  profileImage?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  bio?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  role?: Resolver<ResolversTypes['Role'], ParentType, ContextType>;
  consents?: Resolver<Maybe<Array<ResolversTypes['Consent']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MeResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['MeResponse'] = ResolversParentTypes['MeResponse']> = {
  me?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ConsentResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['ConsentResponse'] = ResolversParentTypes['ConsentResponse']> = {
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type HellowWorldDataResolvers<ContextType = any, ParentType extends ResolversParentTypes['HellowWorldData'] = ResolversParentTypes['HellowWorldData']> = {
  hello?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  me?: Resolver<ResolversTypes['MeResponse'], ParentType, ContextType>;
  helloWorld?: Resolver<ResolversTypes['HellowWorldData'], ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  addConsent?: Resolver<Maybe<ResolversTypes['ConsentResponse']>, ParentType, ContextType, RequireFields<MutationAddConsentArgs, 'type'>>;
  register?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationRegisterArgs, never>>;
  registerUserFromExternalProvider?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationRegisterUserFromExternalProviderArgs, never>>;
  updateUserProfileImage?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationUpdateUserProfileImageArgs, 'file'>>;
};

export type Resolvers<ContextType = any> = {
  Upload?: GraphQLScalarType;
  Consent?: ConsentResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  MeResponse?: MeResponseResolvers<ContextType>;
  ConsentResponse?: ConsentResponseResolvers<ContextType>;
  HellowWorldData?: HellowWorldDataResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
