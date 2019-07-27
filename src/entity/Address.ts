import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, BaseEntity } from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';
import {User} from './User';


@ObjectType()
@Entity()
export class Address extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  public id: number;

  @Field()
  @Column()
  public address: string;

  @Field()
  @Column()
  public lamp: number;

  @Field()
  @Column()
  public lang: number;

  @ManyToOne(() => User, (author: User) => author.addresses)
  public author: User;


}
