import {BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Field, ID, ObjectType} from "type-graphql";
import {Order} from "./Order";


@ObjectType()
@Entity()
export class Driver extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  public id: number;

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
  @Column({default: true})
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

}