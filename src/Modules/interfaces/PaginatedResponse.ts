import { ClassType, Field, ObjectType } from "type-graphql";

export default function PaginationResponse<T>(Items: ClassType<T>) {
  @ObjectType(`Paginated${Items.name}Response`)
  abstract class PaginationResponseClass {
    @Field(() => [Items])
    public items: T[];

    @Field({ name: "total_pages" })
    public totalPages: number;

    @Field({ name: "total_count" })
    public totalCount: number;
  }
  return PaginationResponseClass;
}
