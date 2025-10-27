import { GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";



export const SayHelloArgsType =  {
         name: {type: GraphQLString, description: 'name of the person'},
         age: {type: new GraphQLNonNull(GraphQLInt)}
    
    }

export const SignUpArgsType = {
  firstName: { type: new GraphQLNonNull(GraphQLString) },
  lastName: { type: new GraphQLNonNull(GraphQLString) },
  email: { type: new GraphQLNonNull(GraphQLString) },
  password: { type: new GraphQLNonNull(GraphQLString) },
};

export const LoginArgsType = {
  email: { type: new GraphQLNonNull(GraphQLString) },
  password: { type: new GraphQLNonNull(GraphQLString) },
};
