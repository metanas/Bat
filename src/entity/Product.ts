import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
  ManyToMany,
  JoinTable
} from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import {ProductPicture} from "./ProductPicture";
import {Category} from "./Category";

@ObjectType()
@Entity()
export class Product extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  public id: number;

  @Field()
  @Column()
  public name: string;

  @Field()
  @Column()
  public priceCent: number;

  @Field()
  @Column()
  public weight: number;

  @Field()
  @Column()
  public unit: string;

  @Field()
  @Column()
  public quantity: number;

  @Field()
  @Column({ default: false })
  public enabled: boolean;

  @Field()
  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  public create_at: string;

  @Field(() => [ProductPicture])
  @OneToMany(() => ProductPicture, (productPicture: ProductPicture) => productPicture.product)
  @JoinTable()
  public productPictures: ProductPicture[];

  @ManyToMany(() => Category)
  @JoinTable()
  public categories: Category[];
}

