import {connection} from "../../test-utils/connection";
import {Connection} from "typeorm";
import {createUserGroupHelper} from "../../helper/createUserGroupHelper";
import {createUserHelper} from "../../helper/createUserHelper";
import {graphqlCall} from "../../test-utils/graphqlCall";
import {truncate} from "../../helper/truncateTables";
import {UserGroup} from "../../../src/entity/UserGroup";
import {User} from "../../../src/entity/User";
import createCouponHelper from "../../helper/createCouponHelper";
import {take} from "lodash";

let conn: Connection;
let user: User;
let userGroup: UserGroup;
beforeAll(async () => {
  conn = await connection();
  userGroup = await createUserGroupHelper();
  user = await createUserHelper(userGroup);
});

afterAll(async () => {
  await conn.close();
});

describe("Test Coupon Resolver", () => {
  it("Test add Coupon", async () => {
    await truncate(conn, "coupon");
    const addCouponQuery = `mutation {
      addCoupon(name: "test", couponUse: 2, discountAmount: 10, dateBegin: "2019-09-07T18:40:46", dateEnd: "2019-09-10T00:00:00", discountType: "amount", key: "HA893IUD") {
        name
        couponUse
      }
    }`;

    const response = await graphqlCall({
      source: addCouponQuery,
      user,
      isAdmin: true
    });

    expect(response).toMatchObject({
      data: {
        addCoupon: {
          name: "test",
          couponUse: 2
        }
      }
    });
  });

  it("Test Remove Coupon", async () => {
    const coupon = await createCouponHelper();

    const removeCouponQuery = `mutation {
      removeCoupon(id: ${coupon.id})
    }`;

    const response = await graphqlCall({
      source: removeCouponQuery,
      user,
      isAdmin: true
    });

    expect(response).toMatchObject({
      data: {
        removeCoupon: true
      }
    });
  });

  it("Test Update Coupon", async () => {
    const coupon = await createCouponHelper();

    const updateCouponQuery = `mutation {
      updateCoupon(id: ${coupon.id}, name: "test", couponUse: 2, discountAmount: 10, dateBegin: "2019-09-07T18:40:46", dateEnd: "2019-09-10T00:00:00", discountType: "amount", key: "KO829SDO") {
        name
        couponUse
        discountAmount
        discountType
        key
      }
    }`;

    const response = await graphqlCall({
      source: updateCouponQuery,
      user,
      isAdmin: true
    });

    expect(response).toMatchObject({
      data: {
        updateCoupon: {
          name: "test",
          couponUse: 2,
          discountAmount: 10,
          discountType: "amount",
          key: "KO829SDO"
        }
      }
    });
  });

  it("Test Get Coupons", async () => {
    await truncate(conn, "coupon");

    const couponList: {id: string}[] = [];

    for(let i=0; i< 22; i++) {
      const coupon = await createCouponHelper();
      couponList.push({ id: coupon.id.toString() });
    }

    const getCouponsQuery = `{
      getCoupons(page: 1, limit: 10) {
        items {
          id
        }
        total_pages
        total_count
      }
    }`;

    const response = await graphqlCall({
      source: getCouponsQuery,
      user,
      isAdmin: true
    });

    expect(response).toMatchObject({
      data: {
        getCoupons: {
          items: take(couponList, 10),
          "total_pages": 3,
          "total_count": 22
        }
      }
    })
  });
});
