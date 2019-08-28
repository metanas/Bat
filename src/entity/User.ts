import {Column, Entity, PrimaryGeneratedColumn, BaseEntity} from "typeorm";
import {Field, ID, ObjectType} from "type-graphql";

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

  @Column({ type: "jsonb" })
  public permissions: object;
}
