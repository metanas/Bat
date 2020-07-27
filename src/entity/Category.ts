import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Field, ID, Int, ObjectType } from "type-graphql";
import { ProductCategory } from "./ProductCategory";

@ObjectType()
@Entity()
export class Category extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  public id: number;

  @Field()
  @Column({ type: "citext" })
  public name: string;

  @Column({
    name: "create_at",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  public create_at: string;

  @Column({ default: false })
  public state: boolean;

  @Field(() => [ProductCategory])
  @OneToMany(
    () => ProductCategory,
    (productCategory: ProductCategory) => productCategory.category
  )
  @JoinTable()
  productCategory: ProductCategory;

  @Field(() => Int)
  public async count() {
    return await ProductCategory.count({ where: { categoryId: this.id } });
  }
}
