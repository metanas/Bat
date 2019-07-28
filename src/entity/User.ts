import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToOne,JoinColumn,OneToMany,ManyToMany, JoinTable } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import { Address } from "./Address";
import {Coupon} from "./Coupon";
import {Favourite} from "./Favourite";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  public id: number;

  @Field()
  @Column()
  public name: string;

  @Field()
  @Column({unique: true})
  public telephone: string;

  @Field()
  @Column({default: false})
  public status: boolean;

  @Field()
  @Column({ nullable: true })
  public birthday: string;

  @Field()
  @Column({nullable: true})
  public avatar: string;

  @Field()
  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  public date_added: string;

  @OneToMany(() => Address, (address: Address) => address.user)
  public addresses: Address[];

  @ManyToMany(() => Coupon)
  @JoinTable()
  coupons: Coupon[];

  @OneToOne(() => Favourite)
  @JoinColumn()
  public favourite: Favourite;

}
