import {Column, Entity, PrimaryGeneratedColumn, BaseEntity, ManyToOne} from "typeorm";
import {Field, ID, ObjectType} from "type-graphql";
import {UserGroup} from "./UserGroup";

@Entity()
@ObjectType()
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn({ type: "uuid"})
  public id: any;

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
