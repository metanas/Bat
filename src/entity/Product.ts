import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany, ManyToMany, JoinTable} from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import {ProductPicture} from "./ProductPicture";
import {Coupons} from "./Coupons";
import {Category} from "./Category";

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

  @ManyToMany(() => Coupons)
  @JoinTable()
  coupons: Coupons[];

  @ManyToMany(() => Category)
  @JoinTable()
  categories: Category[];

}

