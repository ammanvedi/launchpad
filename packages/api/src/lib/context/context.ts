import {IAuthorizer} from "../authorization/IAuthorizer";

export type GQLContext<AuthorizerConfig = any> = {
    authorizer: IAuthorizer<AuthorizerConfig>
}

