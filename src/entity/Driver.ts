import {BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Field, ID, ObjectType} from "type-graphql";
import {Order} from "./Order";


@ObjectType()
@Entity()
export class Driver extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @Field()
  @Column()
  public name: string;

  @Field()
  @Column({unique: true})
  public telephone: string;

  @Field()
  @Column()
  public point: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  public avatar?: string;

  @Field()
  @Column()
  public longitude: string;

  @Field()
  @Column()
  public latitude: string;

  @OneToMany(() => Order, (order: Order) => order.driver)
  public orders: Order[];

}