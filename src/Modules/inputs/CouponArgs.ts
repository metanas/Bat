import { ArgsType, Field } from "type-graphql";
import { IsDateString, IsInt, IsString, Max } from "class-validator";

@ArgsType()
export class CouponArgs {
  @Field()
  @IsString()
  public name: string;

  @Field()
  @IsString()
  public key: string;

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

  @Field({ nullable: true })
  @IsDateString()
  public dateEnd: string;

  @Field()
  @IsInt()
  public couponUse: number;
}
