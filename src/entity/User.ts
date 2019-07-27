import { Entity, PrimaryGeneratedColumn,OneToMany, Column, BaseEntity } from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';
import {Address} from './Address';


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
    @Column({ unique: true })
    public telephone: string;

    @Field()
    @Column({ default: false })
    public status: boolean;

    @Field()
    @Column()
    public birthday: string;

    @Field()
    @Column()
    avatar: string;

   @OneToMany(() => Address, (address: Address) => address.user)
   public addresses: Address[];
}
