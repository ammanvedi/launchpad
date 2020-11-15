import {
    ApolloServerPlugin,
    BaseContext, GraphQLFieldResolverParams,
    GraphQLRequestContext, GraphQLRequestContextExecutionDidStart, GraphQLRequestExecutionListener,
    GraphQLRequestListener, GraphQLRequestListenerDidResolveField, GraphQLRequestListenerExecutionDidEnd
} from 'apollo-server-plugin-base';
import {createLoggerSet} from "../logging/logger";

const log = createLoggerSet('RBAC Controller');



export const rbacExtension: ApolloServerPlugin = {
    requestDidStart(requestContext: GraphQLRequestContext<BaseContext>): GraphQLRequestListener<BaseContext> | void {
        return {
            executionDidStart(requestContext: GraphQLRequestContextExecutionDidStart<BaseContext>): GraphQLRequestExecutionListener | GraphQLRequestListenerExecutionDidEnd | void {
                return {
                    willResolveField({context, source, args, info}: GraphQLFieldResolverParams<any, BaseContext>): GraphQLRequestListenerDidResolveField | void {
                        console.log('did start resolving', info.fieldName, info.path);
                        console.log('args', args);
                        //throw new Error('booomboooclaaat')
                        return () => {
                            console.log('did finish resolving')                        }
                    }
                }
            }
        }
    }
}