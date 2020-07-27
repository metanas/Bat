import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";
import { Costumer } from "./Costumer";
import { Coupon } from "./Coupon";

@ObjectType()
@Entity()
export class CostumerCoupon extends BaseEntity {
  @PrimaryColumn()
  public costumerId: number;

  @PrimaryColumn()
  public couponId: number;

  @Field(() => Costumer)
  @ManyToOne(() => Costumer, { primary: true })
  @JoinColumn({ name: "costumerId" })
  public costumer: Costumer;

  @ManyToOne(() => Coupon, (costumer: Costumer) => costumer.coupons, {
    primary: true,
  })
  @JoinColumn({ name: "couponId" })
  public coupon: Coupon;

  @Field()
  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  public create_at: string;
}
