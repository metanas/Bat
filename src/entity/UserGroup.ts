import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {Field, ObjectType} from "type-graphql";
import {PermissionType} from "../Modules/PermissionType";

@ObjectType()
@Entity()
export class UserGroup extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  public id: number;

  @Field()
  @Column()
  public name: string;


  @Field(() => PermissionType)
  @Column({ type: "jsonb" })
  public permissions: PermissionType;
}
