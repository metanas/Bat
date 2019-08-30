import {BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Field, ObjectType} from "type-graphql";
import {UserGroup} from "./UserGroup";

@Entity()
@ObjectType()
export class User extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  public name: string;

  @Column()
  password: string;

  @Field()
  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  public create_at: string;

  @Field()
  @Column({ default: true })
  public active: boolean;

  @Field(() => UserGroup)
  @ManyToOne(() => UserGroup)
  public userGroup: UserGroup;
}
