import {Entity, PrimaryGeneratedColumn, BaseEntity, ManyToOne} from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import {User} from "./User";
import {Coupons} from "./Coupons";

@ObjectType()
@Entity()
export class UserCoupons extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  public id: number;

  @ManyToOne(() => User, (user: User) => user.userCoupons)
  public user: User;

  @ManyToOne(() => Coupons, (coupons: Coupons) => coupons.userCoupons)
  public coupons: Coupons;

}