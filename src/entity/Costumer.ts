import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Field, ID, ObjectType, Int } from "type-graphql";
import { Address } from "./Address";
import { Coupon } from "./Coupon";
import { Cart } from "./Cart";
import { Order } from "./Order";
import { CostumerCoupon } from "./CostumerCoupon";
import { Favourite } from "./Favourite";

@ObjectType()
@Entity()
export class Costumer extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @Field()
  @Column({ type: "citext" })
  public name: string;

  @Field()
  @Column({ unique: true })
  public telephone: string;

  @Field()
  @Column({ default: false })
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

  @OneToMany(() => Address, (address: Address) => address.costumer)
  public addresses: Address[];

  @OneToMany(
    () => Coupon,
    (costumerCoupon: CostumerCoupon) => costumerCoupon.costumer
  )
  @JoinTable()
  public coupons: CostumerCoupon[];

  @OneToOne(() => Cart)
  @JoinTable()
  public cart: Cart;

  @OneToMany(() => Order, (order: Order) => order.costumer)
  public orders: Order[];

  @Field(() => [Favourite])
  @OneToMany(() => Favourite, (favourite: Favourite) => favourite.costumer)
  @JoinTable()
  favourite: Favourite;

  @Field(() => Int)
  public async count() {
    return await Favourite.count({ where: { costumerId: this.id } });
  }
}
