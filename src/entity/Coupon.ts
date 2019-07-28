import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToMany, JoinTable } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
@Entity()
export class Coupon extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  public id: number;

  @Field()
  @Column()
  public name: string;

  @Field()
  @Column({ name: "discount_type" })
  public discountType: string;

  @Field()
  @Column({ name: "discount_percent" })
  public discountPercent: number;

  @Field()
  @Column({ name: "discount_amount" })
  public discountAmount: number;

  @Field()
  @Column({ name: "date_begin" })
  public dateBegin: number;

  @Field()
  @Column({ name: "date_end", nullable: true })
  public dateEnd: number;

  @Field()
  @Column()
  public couponUse: number;

  @Field()
  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  public date_added: string;

  @ManyToMany(() => Coupon)
  @JoinTable()
  public coupons: Coupon[];

}
