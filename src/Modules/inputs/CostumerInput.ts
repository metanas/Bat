import { Field, InputType } from "type-graphql";

@InputType()
export class CostumerInput {
  @Field()
  public name: string;

  @Field()
  public telephone: string;

  @Field({nullable: true })
  public birthday: string;
}
