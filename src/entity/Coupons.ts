import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
@Entity()
export class Coupons extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  public id: number;

  @Field()
  @Column()
  public name: string;

  @Field()
  @Column()
  public discountType: string;

  @Field()
  @Column()
  public discountPercent: number;

  @Field()
  @Column()
  public discountAmount: number;

  @Field()
  @Column()
  public dateBegin: number;

  @Field()
  @Column()
  public dateEnd: number;

  @Field()
  @Column()
  public couponUse: number;

}
