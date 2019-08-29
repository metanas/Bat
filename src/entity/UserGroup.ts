import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {ObjectType} from "type-graphql";

@ObjectType()
@Entity()
export class UserGroup extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @Column({ type: "jsonb" })
  public permissions: object;
}
