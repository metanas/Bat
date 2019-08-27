import {Field, ObjectType} from "type-graphql";
import {BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn} from "typeorm";
import {User} from "./User";
import {Coupon} from "./Coupon";

@ObjectType()
@Entity()
export class UserCoupon extends BaseEntity {
  @PrimaryColumn()
  public userId: number;

  @PrimaryColumn()
  public couponId: number;

  @Field(() => User)
  @ManyToOne(() => User, { primary: true})
  @JoinColumn({ name: "userId"})
  public user: User;

  @ManyToOne(() => Coupon,(user: User) => user.coupons, {primary: true})
  @JoinColumn({ name: "couponId" })
  public coupon: Coupon;

  @Field()
  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  public create_at: string;
}
