import {
  BaseEntity,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";
import { Field, ObjectType } from "type-graphql";
import { Costumer } from "./Costumer";
import { Product } from "./Product";

@ObjectType()
@Entity()
export class Favourite extends BaseEntity {
  @PrimaryColumn("uuid")
  public costumerId: string;

  @PrimaryColumn()
  public productId: number;

  @Field(() => Costumer)
  @ManyToOne(() => Costumer, { primary: true })
  @JoinColumn({ name: "costumerId" })
  public costumer: Costumer;

  @Field(() => Product)
  @ManyToOne(() => Product, { primary: true })
  @JoinColumn({ name: "productId" })
  public product: Product;
}
