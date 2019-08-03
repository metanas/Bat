import {Field, ID, ObjectType} from "type-graphql";
import {BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Cart} from "./Cart";


@ObjectType()
@Entity()
export class CartProduct extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  public id: number;

  @Field()
  @Column()
  public quantity: number;

  @Field()
  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  public date_added: string;

  @ManyToOne(() => Cart, (cart: Cart) => cart.cartProducts)
  public cart: Cart;

}