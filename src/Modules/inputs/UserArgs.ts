import {ArgsType, Field} from "type-graphql";
import {IsEmail, IsString} from "class-validator";

@ArgsType()
export class UserArgs {
  @Field({ nullable: true })
  @IsString()
  public name: string;

  @Field()
  @IsEmail()
  public email: string;

  @Field()
  public password: string;
}
