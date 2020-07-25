import PaginatedResponse from "../Modules/interfaces/PaginatedResponse";
import {Address} from "../entity/Address";
import {Product} from "../entity/Product";
import {Coupon} from "../entity/Coupon";
import {Driver} from "../entity/Driver";
import {UserGroup} from "../entity/UserGroup";
import {User} from "../entity/User";
import {Category} from "../entity/Category";
import {Order} from "../entity/Order";
import {Message} from "../entity/Message";

export const PaginatedAddressResponse = PaginatedResponse(Address);
// @ts-ignore
type PaginatedAddressResponse = InstanceType<typeof PaginatedAddressResponse>;

export const PaginatedProductResponse = PaginatedResponse(Product);
// @ts-ignore
type PaginatedProductResponse = InstanceType<typeof PaginatedProductResponse>;

export const PaginatedCouponResponse = PaginatedResponse(Coupon);
// @ts-ignore
type PaginatedCouponResponse = InstanceType<typeof PaginatedCouponResponse>;

export const PaginatedDriverResponse = PaginatedResponse(Driver);
// @ts-ignore
type PaginatedDriverResponse = InstanceType<typeof PaginatedDriverResponse>;

export const PaginatedUserGroupResponse = PaginatedResponse(UserGroup);
// @ts-ignore
type PaginatedUserGroupResponse = InstanceType<typeof PaginatedUserGroupResponse>;

export const PaginatedUserResponse = PaginatedResponse(User);
// @ts-ignore
type PaginatedUserResponse = InstanceType<typeof PaginatedUserResponse>;

export const PaginatedCategoryResponse = PaginatedResponse(Category);
// @ts-ignore
type PaginatedCategoryResponse = InstanceType<typeof PaginatedCategoryResponse>;

export const PaginatedOrderResponse = PaginatedResponse(Order);
// @ts-ignore
type PaginatedOrderResponse = InstanceType<typeof PaginatedOrderResponse>;

export const PaginatedMessageResponse = PaginatedResponse(Message);
// @ts-ignore
type PaginatedMessageResponse = InstanceType<typeof PaginatedMessageResponse>;
