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
import { User } from "./User";

@ObjectType()
@Entity()
export class Product extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  public id: number;

  @Field()
  @Column()
  public priceUnit: number;

  @Field()
  @Column()
  public quantity: number;

  @Field()
  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  public date_added: string;

  @OneToMany(() => ProductPicture, (productPicture: ProductPicture) => productPicture.product)
  public productPictures: ProductPicture[];

  @ManyToMany(() => Category)
  @JoinTable()
  public categories: Category[];

  @ManyToMany(() => User)
  @JoinTable()
  public users: User[];
}

