import { GraphQLNonNull, GraphQLObjectType } from "graphql";
import { UserType } from "../Types/user.types"; 
import { SignUpArgsType, LoginArgsType } from './../Args/user.args';
import UserResolver from '../Resolvers/user.resolver';

class UserMutation {
  private userResolver: UserResolver = new UserResolver();

  register() {
    return {
      signUp: {
        type: UserType,
        args: SignUpArgsType,
        resolve: this.userResolver.signUp,
      },
      login: {
        type: UserType,
        args: LoginArgsType,
        resolve: this.userResolver.login,
      },
    };
  }
}

export default new UserMutation();
