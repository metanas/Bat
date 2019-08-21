import {Field, ID, ObjectType} from "type-graphql";
import {BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {Cart} from "./Cart";
import {Product} from "./Product";


@ObjectType()
@Entity()
export class CartProduct extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  public id: number;

  @Field(() => Product)
  @OneToOne(() => Product)
  @JoinColumn()
  public product: Product;

  @Field()
  @Column()
  public quantity: number;

  @Field()
  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  public create_at: string;

  @ManyToOne(() => Cart, (cart: Cart) => cart.cartProducts)
  public cart: Cart;

}
