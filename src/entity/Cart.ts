import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import {Field, ID, Int, ObjectType} from "type-graphql";
import {Coupon} from "./Coupon";
import {CartProduct} from "./CartProduct";
import {Costumer} from "./Costumer";

@ObjectType()
@Entity()
export class Cart extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  public id: number;

  @ManyToOne(() => Coupon, (coupon: Coupon) => coupon.carts)
  public coupon?: Coupon;

  @Field(() => [CartProduct])
  @OneToMany(() => CartProduct, (cartProduct: CartProduct) => cartProduct.cart, { eager: true })
  @JoinTable()
  public cartProducts?: CartProduct[];

  @Field(() => Costumer)
  @OneToOne(() => Costumer, (costumer: Costumer) => costumer.cart)
  @JoinColumn()
  public costumer: Costumer;

  @Field(() => Int, { name: "count" })
  public count(): number {
    if(this.cartProducts)
      return this.cartProducts.length;
    return 0
  }

  @Column({ name: "create_at" ,type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  public create_at: string;
}
