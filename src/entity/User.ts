import {BaseEntity, Column, Entity, JoinTable, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {Field, ID, ObjectType} from "type-graphql";
import {Address} from "./Address";
import {Coupon} from "./Coupon";
import {Cart} from "./Cart";
import {Order} from "./Order";
import {UserCoupon} from "./UserCoupon";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @Field()
  @Column()
  public name: string;

  @Field()
  @Column({unique: true})
  public telephone: string;

  @Field()
  @Column({default: false})
  public status: boolean;

  @Field()
  @Column({ nullable: true })
  public birthday: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  public avatar?: string;

  @Field()
  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  public create_at: string;

  @OneToMany(() => Address, (address: Address) => address.user)
  public addresses: Address[];

  @OneToMany(() => Coupon, (userCoupon: UserCoupon) => userCoupon.user)
  @JoinTable()
  public coupons: Coupon[];

  @OneToOne(() => Cart)
  @JoinTable()
  public cart: Cart;

  @OneToMany(() => Order, (order: Order) => order.user)
  public orders: Order[];

}
