import {BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Field, ID, ObjectType} from "type-graphql";
import {UserGroup} from "./UserGroup";

@Entity()
@ObjectType()
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @Field()
  @Column({ type: "citext", unique: true })
  public name: string;

  @Field()
  @Column({ type: "citext" ,unique: true })
  public email: string;

  @Column()
  public password: string;

  @Field()
  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  public create_at: string;

  @Field()
  @Column({ default: false })
  public active: boolean;

  @Field(() => UserGroup)
  @ManyToOne(() => UserGroup, { eager: true })
  public userGroup: UserGroup;

  @Column({ default: 0 })
  public tokenVersion: number;
}
