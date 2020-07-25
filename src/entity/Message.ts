import {Field, ID, ObjectType} from "type-graphql";
import {BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Costumer} from "./Costumer";


@ObjectType()
@Entity()
export class Message extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  public id: number;

  @Field()
  @Column()
  public content: string;

  @Field()
  @Column({default: false})
  public byAdmin: boolean;

  @Field()
  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  public create_at: string;

  @ManyToOne(() => Costumer, (costumer: Costumer) => costumer.messages ,{eager: true})
  public costumer: Costumer;

}