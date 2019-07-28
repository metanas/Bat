import {Entity, PrimaryGeneratedColumn, ManyToOne, Column, BaseEntity, JoinColumn, OneToOne} from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import { User } from "./User";
import {Order} from "./Order";

@ObjectType()
@Entity()
export class Address extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  public id: number;

  @Field()
  @Column()
  public address: string;

  @Field()
  @Column()
  public longitude: number;

  @Field()
  @Column()
  public latitude: number;

  @Field()
  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  public date_added: string;

  @ManyToOne(() => User, (user: User) => user.addresses)
  public user: User;

  @OneToOne(() => Order)
  @JoinColumn()
  public order: Order;
}
