import {Field, ObjectType} from "type-graphql";
import {BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn} from "typeorm";
import {Cart} from "./Cart";
import {Product} from "./Product";


@ObjectType()
@Entity()
export class CartProduct extends BaseEntity {
  @PrimaryColumn()
  public cartId: number;

  @PrimaryColumn()
  public productId: number;

  @Field(() => Product)
  @ManyToOne(() => Product, (cart: Cart) => cart.cartProducts, { primary: true, eager: true})
  @JoinColumn({ name: "productId"})
  public product: Product;

  @ManyToOne(() => Cart,{primary: true})
  @JoinColumn({ name: "cartId" })
  public cart: Cart;

  @Field()
  @Column()
  public quantity: number;

  @Field()
  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  public create_at: string;
}
