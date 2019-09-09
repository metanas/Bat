import {BaseEntity, Entity, JoinColumn, ManyToOne, PrimaryColumn} from "typeorm";
import {Category} from "./Category";
import {Product} from "./Product";
import {Field, ObjectType} from "type-graphql";

@ObjectType()
@Entity()
export class ProductCategory extends BaseEntity{
  @PrimaryColumn()
  public categoryId: number;

  @PrimaryColumn()
  public productId: number;

  @Field(() => Category)
  @ManyToOne(() => Product, { primary: true })
  @JoinColumn({ name: "categoryId"})
  public category: Category;

  @Field(() => Product)
  @ManyToOne(() => Product, { primary: true })
  @JoinColumn({ name: "productId" })
  public product: Product;

}
