import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, OneToMany, JoinTable} from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import {Coupon} from "./Coupon";
import {Costumer} from "./Costumer";
import {OrderProduct} from "./OrderProduct";
import {Driver} from "./Driver";

@ObjectType()
@Entity()
export class Order extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @Field()
  @Column({ nullable: true })
  public orderDate?: number;

  @Field()
  @Column({ nullable: true })
  public paymentMethod: string;

  @Field()
  @Column({ default: "In Progress" })
  public status: string;

  @Field({ nullable: true })
  @Column({ type: "citext" , nullable: true })
  public driverName?: string;

  @Field()
  @Column()
  public address: string;

  @ManyToOne(() => Coupon, (coupon: Coupon) => coupon.orders, { nullable : true })
  public coupon?: Coupon;

  @ManyToOne(() => Costumer, (costumer: Costumer) => costumer.orders)
  public costumer: Costumer;

  @Field(() => [OrderProduct])
  @OneToMany(() => OrderProduct, (orderProduct: OrderProduct) => orderProduct.order, { onDelete:"CASCADE", eager: true })
  @JoinTable()
  public orderProducts: OrderProduct[];

  @Column({ name: "create_at" ,type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  public create_at: string;

  @Field(() => [Driver])
  @ManyToOne(() => Driver, (driver: Driver) => driver.orders, { nullable: true, eager: true })
  public driver: Driver;

}
