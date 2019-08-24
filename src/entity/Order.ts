import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, OneToMany, JoinTable} from "typeorm";
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
  @Column({ nullable: true })
  public orderDate?: number;

  @Field()
  @Column({ nullable: true })
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

  @ManyToOne(() => Coupon, (coupon: Coupon) => coupon.orders, { nullable : true})
  public coupon?: Coupon;

  @ManyToOne(() => User, (user: User) => user.orders)
  public user: User;

  @Field(() => [OrderProduct])
  @OneToMany(() => OrderProduct, (orderProduct: OrderProduct) => orderProduct.order)
  @JoinTable()
  public orderProducts: OrderProduct[];

  @Column({ name: "create_at" ,type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  public create_at: string;

}
