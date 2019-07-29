import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne} from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import {Order} from "./Order";


@ObjectType()
@Entity()
export class OrderProduct extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  public id: number;

  @Field()
  @Column()
  public price: number;

  @Field()
  @Column()
  public quantity: number;

  @ManyToOne(() => Order, (order: Order) => order.orderProducts)
  public order: Order;
}