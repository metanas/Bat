import {Field, InputType} from "type-graphql";
import { IsInt, Max, Min } from "class-validator";

@InputType()
export class PaginatedResponseInput {
  @Field()
  @IsInt()
  public page!: number;

  @Field()
  @IsInt()
  @Max(100)
  @Min(1)
  public limit!: number;
}
