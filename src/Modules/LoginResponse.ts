import { Field, ObjectType } from "type-graphql";
import { User } from "../entity/User";

@ObjectType()
export class LoginResponse {
  @Field()
  public accessToken: string;

  @Field(() => User)
  public user: User;
}
