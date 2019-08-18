import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToOne,JoinColumn,OneToMany,ManyToMany, JoinTable } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import { Address } from "./Address";
import {Coupon} from "./Coupon";
import {Cart} from "./Cart";
import {Order} from "./Order";
import {Product} from "./Product";

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

  @ManyToMany(() => Coupon)
  @JoinTable()
  public coupons: Coupon[];

  @ManyToMany(() => Product)
  @JoinColumn()
  public products: Product[];

  @OneToOne(() => Cart)
  @JoinTable()
  public cart: Cart;

  @OneToMany(() => Order, (order: Order) => order.user)
  public orders: Order[];

}
