import { GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";
import userQuery from "./Schema/Query/user.query";
import userMutation from "./Mutations/user.mutation";


const UserQuery = require('./Schema/Query/user.query')



export const MainSchema = new GraphQLSchema({ 
    query: new GraphQLObjectType({
name: "QueryMainSchema",
description: 'This the query main schema', 
fields:{
    ...userQuery.register()

}
}),
mutation: new GraphQLObjectType({
    name: "MutationMainSchema",
    fields: { ...userMutation.register() },
  }),
    })
