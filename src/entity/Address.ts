import {Entity, PrimaryGeneratedColumn, ManyToOne, Column, BaseEntity} from "typeorm";
import {ObjectType, Field, ID } from "type-graphql";
import { Costumer } from "./Costumer";

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
  public longitude: string;

  @Field()
  @Column()
  public latitude: string;

  @Field()
  @Column({ name: "create_at" ,type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  public create_at: string;

  @ManyToOne(() => Costumer, (costumer: Costumer) => costumer.addresses)
  public costumer: Costumer;

}
