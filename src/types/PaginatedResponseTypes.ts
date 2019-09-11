import PaginatedResponse from "../Modules/interfaces/PaginatedResponse";
import {Address} from "../entity/Address";

export const PaginatedAddressResponse = PaginatedResponse(Address);
// @ts-ignore
type PaginatedAddressResponse = InstanceType<typeof PaginatedAddressResponse>;
