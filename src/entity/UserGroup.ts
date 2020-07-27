import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Field, ObjectType } from "type-graphql";
import { PermissionType } from "../Modules/PermissionType";
import { User } from "./User";

@ObjectType()
@Entity()
export class UserGroup extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  public id: number;

  @Field()
  @Column({ type: "citext" })
  public name: string;

  @Field(() => PermissionType)
  @Column({ type: "jsonb" })
  public permissions: PermissionType;

  @OneToMany(() => User, (user: User) => user.userGroup)
  public user: User[];
}
