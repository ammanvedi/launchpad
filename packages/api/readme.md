# API

The API provides access to the backend data store through a GraohQL interface. It also talks directly to AWS Cognito so sign up users.



## Directory Structure

```
.
├── prisma										    # Contains all data for Prisma 2
│   └── migrations							# Migrations
│       └── 20201220182833_initial			# The initial migration
└── src
    ├── generated									# Graphql codegen autogenerated files
    └── lib
        ├── authorization							# Code for interacting with Cognito
        ├── context									# Definition for GraphQL context
        ├── data
        │   └── data-loader					# Data loader implementations
        ├── error									# Helpers for manageing errors
        ├── logging								    # Logging helpers
        ├── media									# Code for handling media upload + storage
        └── resolver
            ├── field								# GraphQL field resolver
            ├── mutation							# GraphQL mutation resolver
            └── query								# GraphQL query resolver
```

## NPM Scripts



`npm run build` - Build the application for production



`npm run start` - Start the production application



`npm run dev` - start the application in development mode. The code will be watched by nodemon and the server restarted as needed.



`npm run codegen` - Generate new typescript definitions after you change the `schema.ts` file



`prisma:generate` - Regenerate the prisma client, useful after you have made any changes to the `schema.prisma` file



`prisma:save-migration` - When you have made a change to `schema.prisma` this will apply these changes to the local development database and also run `prisma:generate ` It will prompt you for a name for the migration and then save it in the migrations directory.



`prisma:apply-migration` - Used in production to update the database schema based on the contents of the migrations directory



`prisma:reset` - Clear the database, only for development. If you run it in prod youll have a bad time.



##  Prisma

Prisma is used to manage the database schema for the application, and also to generate a Typescript SDK for interacting with that data. You can read more about prisma [here](https://www.prisma.io/)

**NOTE: The application uses Prisma version 2**



## Codegen

In order to generate typescript definitions for Graphql schema types and for generating resolver types graphql-codegen is used, you can run the `npm run codegen` npm task to update these definitions.



## Dataloader

Dataloader allows for short term (one-tick) caching of api calls. The reason for this is evident in the following, shortened, example taken from this codebase

given the schema;

```
Schema {

	type User {
		id: ID!
		name: String!
		age: Number!
		consents: [Consent!]!
	}

	type Consent {
		id: ID!
		type: String!
	}

	Query {
		userById(id: ID!): User
	}

}
```

lets say that we structure our resolver like so

````javascript
// Root resolver
const userByIdresolver = async (parent, context, args, info) => {
  const user = await db.fetchUserById(args.id)

  return user;
}

// Field Resolvers

const userFieldResolvers = {
  consents: async (parent, context, args, info) => {
    const consents = await db.fetchConsentsForUser(parent.id)
    return consents;
  }
}
````

based on this lets reason about the following queries and analyse how each gets resolved in terms of requests to the database

````
query QueryA {
	userById(id: "1") {
		id
		name
		consents {
			id
			type
		}
	}
}

query QueryB {
	userById(id: "1") {
		id
		name
	}
}

query QueryC {
	userById(id: "1") {
		consents {
			id
			type
		}
	}
}
````

#### Query A

In this case we make a network request for the user in the root resolver and then a further request for the consents, which is fine and makes sense.

#### Query B

In this case we make a request for the user data, but since we do not have the consents in the request fieldset the consents resolver never gets hit and we avoid maing that request, happy days

#### Query C

Here we only request the consents of the user. However because we have implemented a fetch in the root resolver we are going to end up doing the user fetch and discarding the data.

In order to resolve this we need to avoid doing the fetch in the root resolver and defer it to the field resolvers like so

````javascript
// Root resolver
const userByIdresolver = async (parent, context, args, info) => {
  return { id: args.id };
}

// Field Resolvers

const userFieldResolvers = {
  name: async parent => await db.fetchUserById(parent.id).name,
  age: async parent => await db.fetchUserById(parent.id).age,
  consents: async (parent, context, args, info) => {
    const consents = await db.fetchConsentsForUser(parent.id)
    return consents;
  }
}
````

With this change the fetch for the user will only be done when we actually fetch fields that relate to the data stored in teh users table. However the problem is actually worse now since we do the fetch each time. What we need to do in this case is be able to cache the calls to fetchUserById for the duration of a single request.

This is what dataloader accomplishes

```javascript
const userFieldResolvers = {
  name: async parent => await loaders.userById(parent.id).name,
  age: async parent => await loaders.userById(parent.id).age,
  consents: async (parent, context, args, info) => {
    const consents = await db.fetchConsentsForUser(parent.id)
    return consents;
  }
}
```

And it also does other cool things like alow us to define how requests get batched. To see a example of this in code take a look at the data loader in

`packages/api/src/lib/data/data-loader/user.ts`

and check out its usage in

`packages/api/src/lib/resolver/field/user.ts`
