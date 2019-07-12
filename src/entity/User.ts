import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';


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
}
