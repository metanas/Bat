import {BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn} from "typeorm";
import {Field, ObjectType} from "type-graphql";
import {Order} from "./Order";
import {Product} from "./Product";


@ObjectType()
@Entity()
export class OrderProduct extends BaseEntity {
  @PrimaryColumn()
  public orderId: number;

  @PrimaryColumn()
  public productId: number;

  @Field()
  @Column()
  public price: number;

  @Field()
  @Column()
  public quantity: number;

  @Field(() => Product)
  @ManyToOne(() => Product, (order: Order) => order.orderProducts, { primary: true, eager: true })
  @JoinColumn({name: "productId"})
  public product: Product;

  @ManyToOne(() => Order, { primary: true })
  @JoinColumn({ name: "orderId"})
  public order: Order;
}
