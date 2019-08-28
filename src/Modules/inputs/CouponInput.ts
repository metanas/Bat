import {Field, InputType} from "type-graphql";
import {IsDateString, IsInt, IsString, Max} from "class-validator";

@InputType()
export class CouponInput {
  @Field()
  @IsString()
  public name!: string;

  @Field()
  @IsString()
  public key!: string;

  @Field()
  public discountType: string;

  @Field({ nullable: true })
  @IsInt()
  @Max(100)
  public discountPercent?: number;

  @Field({ nullable: true })
  @IsInt()
  public discountAmount: number;

  @Field()
  @IsDateString()
  public dateBegin: string;

  @Field()
  @IsDateString()
  public dateEnd: string;

  @Field()
  @IsInt()
  public couponUse: number;
}
