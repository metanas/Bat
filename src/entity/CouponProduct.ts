import {Field, ObjectType} from "type-graphql";
import {BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn} from "typeorm";
import {Product} from "./Product";
import {Coupon} from "./Coupon";


@ObjectType()
@Entity()
export class CouponProduct extends BaseEntity {
  @PrimaryColumn()
  public couponId: number;

  @PrimaryColumn()
  public productId: number;

  @Field(() => Product)
  @ManyToOne(() => Product,  { primary: true})
  @JoinColumn({ name: "productId"})
  public product: Product;

  @ManyToOne(() => Coupon, (coupon: Coupon) => coupon.couponProducts, { primary: true })
  @JoinColumn({ name: "couponId" })
  public coupon: Coupon;

  @Field()
  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  public create_at: string;
}
