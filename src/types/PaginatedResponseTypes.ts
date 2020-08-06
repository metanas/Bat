/* eslint-disable @typescript-eslint/ban-ts-comment,prettier/prettier */
import PaginatedResponse from "../Modules/interfaces/PaginatedResponse";
import { Address } from "../entity/Address";
import { Product } from "../entity/Product";
import { Coupon } from "../entity/Coupon";
import { Driver } from "../entity/Driver";
import { UserGroup } from "../entity/UserGroup";
import { User } from "../entity/User";
import { Category } from "../entity/Category";
import { Order } from "../entity/Order";

export const PaginatedAddressResponse = PaginatedResponse(Address);
// @ts-ignore
type PaginatedAddressResponse = InstanceType<typeof PaginatedAddressResponse>;

export const PaginatedProductResponse = PaginatedResponse(Product);
// @ts-ignore
export type PaginateProductType = InstanceType<typeof PaginatedProductResponse>;

export const PaginatedCouponResponse = PaginatedResponse(Coupon);
// @ts-ignore
export type PaginatedCouponType = InstanceType<typeof PaginatedCouponResponse>;

export const PaginatedDriverResponse = PaginatedResponse(Driver);
// @ts-ignore
export type PaginatedDriverType = InstanceType<typeof PaginatedDriverResponse>;

export const PaginatedUserGpResponse = PaginatedResponse(UserGroup);

// @ts-ignore
export type PaginatedUserGpResponse = InstanceType<typeof PaginatedUserGpResponse>;

export const PaginatedUserResponse = PaginatedResponse(User);
// @ts-ignore
export type PaginatedUserResponse = InstanceType<typeof PaginatedUserResponse>;

export const PaginatedCategoryResponse = PaginatedResponse(Category);
// @ts-ignore
type PaginatedCategoryResponse = InstanceType<typeof PaginatedCategoryResponse>;

export const PaginatedOrderResponse = PaginatedResponse(Order);
// @ts-ignore
export type PaginatedOrderType = InstanceType<typeof PaginatedOrderResponse>;
