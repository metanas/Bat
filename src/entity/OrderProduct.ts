import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, OneToOne, JoinColumn} from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import {Order} from "./Order";
import {Product} from "./Product";


@ObjectType()
@Entity()
export class OrderProduct extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  public id: number;

  @Field(() => Product)
  @OneToOne(() => Product)
  @JoinColumn()
  public products: Product;

  @Field()
  @Column()
  public price: number;

  @Field()
  @Column()
  public quantity: number;

  @ManyToOne(() => Order, (order: Order) => order.orderProducts)
  public order: Order;

  @Column({ name: "create_at" ,type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  public create_at: string;
}
