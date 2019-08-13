import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  JoinTable,
  OneToMany,
  OneToOne, Column, JoinColumn
} from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import {CartProduct} from "./CartProduct";
import {User} from "./User";

@ObjectType()
@Entity()
export class Cart extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  public id: number;

  @OneToMany(() => CartProduct, (cartProduct: CartProduct) => cartProduct.cart, { onDelete: "CASCADE" })
  @JoinTable()
  public cartProducts?: CartProduct[];

  @Field(() => User)
  @OneToOne(() => User, (user: User) => user.cart)
  @JoinColumn()
  public user: User;

  @Field()
  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  public create_at: string;
}
