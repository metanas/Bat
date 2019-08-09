import {Entity, PrimaryGeneratedColumn, ManyToOne, Column, BaseEntity} from "typeorm";
import {ObjectType, Field, ID } from "type-graphql";
import { User } from "./User";

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
  @Column({ name: "date_added" ,type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  public dateAdded: string;

  @ManyToOne(() => User, (user: User) => user.addresses)
  public user: User;

}
