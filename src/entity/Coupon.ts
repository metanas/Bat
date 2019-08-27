import {BaseEntity, Column, Entity, JoinTable, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Field, ID, ObjectType} from "type-graphql";
import {Cart} from "./Cart";
import {Order} from "./Order";
import {CouponProduct} from "./CouponProduct";

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
  @Column({ unique: true })
  public key: string;

  @Field()
  @Column({ name: "discount_percent" })
  public discountPercent: number;

  @Field()
  @Column({ name: "discount_amount" })
  public discountAmount: number;

  @Field()
  @Column({ type: "timestamp", name: "date_begin" })
  public dateBegin: string;

  @Field()
  @Column({ type: "timestamp", name: "date_end", nullable: true })
  public dateEnd: string;

  @Field()
  @Column()
  public couponUse: number;

  @Field()
  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  public create_at: string;

  @OneToMany(() => CouponProduct, (couponProduct: CouponProduct) => couponProduct.coupon)
  @JoinTable()
  public couponProducts: CouponProduct[];

  @OneToMany(() => Cart, (cart: Cart) => cart.coupon)
  public carts: Cart[];

  @Field(() => [Order])
  @OneToMany(() => Order, (order: Order) => order.coupon)
  @JoinTable()
  public orders: Order[];

  @Field(() => Boolean)
  public isValid() {
    return this.orders.length > this.couponUse
  }
}
