import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";



export const SayHelloResponseType = new GraphQLObjectType({
    name: 'SayHelloResponseType',
    fields:{
        name: {type: GraphQLString, description: 'name of the person'},
        age: {type: new GraphQLNonNull(GraphQLInt)},
        id: {type: GraphQLInt}

    }
})

export const UserType = new GraphQLObjectType({
    name: 'UserType',
    fields: {
        id: {type: GraphQLInt},
        firstName:{type: GraphQLString},
        lastName: {type: GraphQLString},
        email: {type: GraphQLString},
        password: {type: GraphQLString}
    }
})

export const AuthResponseType = new GraphQLObjectType({
  name: "AuthResponse",
  fields: {
    token: { type: GraphQLString },
    message: { type: GraphQLString },
  },
});