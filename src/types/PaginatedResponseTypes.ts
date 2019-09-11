import PaginatedResponse from "../Modules/interfaces/PaginatedResponse";
import {Address} from "../entity/Address";
import {Product} from "../entity/Product";

export const PaginatedAddressResponse = PaginatedResponse(Address);
// @ts-ignore
type PaginatedAddressResponse = InstanceType<typeof PaginatedAddressResponse>;


export const PaginatedProductResponse = PaginatedResponse(Product);
// @ts-ignore
type PaginatedProductResponse = InstanceType<typeof PaginatedProductResponse>;