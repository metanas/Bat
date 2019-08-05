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
  public orderDate: number;

  @Field()
  @Column()
  public paymentMethod: string;

  @Field()
  @Column()
  public status: string;

  @Field()
  @Column()
  public driver: string;

  @Field()
  @Column()
  public address: string;

  @ManyToOne(() => Coupon, (coupon: Coupon) => coupon.orders)
  public coupon: Coupon;

  @ManyToOne(() => User, (user: User) => user.orders)
  public user: User;

  @OneToMany(() => OrderProduct, (orderProduct: OrderProduct) => orderProduct.order)
  public orderProducts: OrderProduct[];

}