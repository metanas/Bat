import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, BaseEntity } from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';
import {Product} from './Product';

@ObjectType()
@Entity()
export class ProductPicture extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  public id: number;

  @Field()
  @Column()
  public avatar: object;

  @ManyToOne(() => Product, (product: Product) => product.productPictures)
  public product: Product[];

}