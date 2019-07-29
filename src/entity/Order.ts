import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne} from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import {Coupon} from "./Coupon";

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

}