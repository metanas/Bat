import {ArgsType, Field, Int} from "type-graphql";
import {IsArray, IsInt, IsString} from "class-validator";

@ArgsType()
export class ProductArgs {
  @Field()
  @IsString()
  public name: string;

  @Field()
  @IsInt()
  public priceCent: number;

  @Field()
  @IsInt()
  public weight: number;

  @Field()
  @IsInt()
  public quantity: number;

  @Field()
  public unit: string;

  @Field(() => [Int])
  @IsArray()
  public categoryIds: number[];
}
