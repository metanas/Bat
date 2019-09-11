import {BaseEntity, Column, Entity, JoinTable, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Field, ID, ObjectType} from "type-graphql";
import {ProductPicture} from "./ProductPicture";
import {ProductCategory} from "./ProductCategory";

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
  @OneToMany(() => ProductPicture, (productPicture: ProductPicture) => productPicture.product, { onDelete: "CASCADE" })
  @JoinTable()
  public productPictures: ProductPicture[];

  @Field(() => [ProductCategory])
  @OneToMany(() => ProductCategory, (productCategory: ProductCategory) => productCategory.product, { onDelete: "CASCADE" })
  @JoinTable()
  public ProductCategory: ProductCategory[];
}

