import {Field, ID, ObjectType} from "type-graphql";
import {BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {Costumer} from "./Costumer";


@ObjectType()
@Entity()
export class Message extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  public id: number;

  @Field()
  @Column()
  public creatorId: string;

  @Field()
  @Column()
  public content: string;

  @Field()
  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  public create_at: string;

  @Field(() => Costumer)
  @OneToOne(() => Costumer, (costumer: Costumer) => costumer.message)
  @JoinColumn()
  public costumer: Costumer;

}