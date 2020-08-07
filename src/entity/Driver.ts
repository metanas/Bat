import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Field, ID, Int, ObjectType } from "type-graphql";
import { Order } from "./Order";

@ObjectType()
@Entity()
export class Driver extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  public id: number;

  @Field()
  @Column({ type: "citext" })
  public name: string;

  @Field()
  @Column({ unique: true })
  public telephone: string;

  @Field()
  @Column()
  public point: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  public avatar?: string;

  @Field()
  @Column({ default: false })
  public isActive: boolean;

  @Field()
  @Column()
  public longitude: string;

  @Field()
  @Column()
  public latitude: string;

  @Field(() => [Order])
  @OneToMany(() => Order, (order: Order) => order.driver)
  public orders: Order[];

  @Field(() => Int)
  public async count(): Promise<number> {
    return Order.count({ where: { driverId: this.id } });
  }
}
