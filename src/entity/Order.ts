import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, OneToMany} from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import {Coupon} from "./Coupon";
import {User} from "./User";
import {OrderProduct} from "./OrderProduct";

@ObjectType()
@Entity()
export class Order extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  public id: number;

  @Field()
  @Column()
  public OrderDate: number;

  @Field()
  @Column()
  public PaymentMethod: string;

  @Field()
  @Column()
  public Status: string;

  @Field()
  @Column()
  public Driver: string;

  @Field()
  @Column()
  public Address: string;

  @ManyToOne(() => Coupon, (coupon: Coupon) => coupon.orders)
  public coupon: Coupon;

  @ManyToOne(() => User, (user: User) => user.orders)
  public user: User;

  @OneToMany(() => OrderProduct, (orderProduct: OrderProduct) => orderProduct.order)
  public orderProducts: OrderProduct[];

}