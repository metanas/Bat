import {Coupon} from "../../src/entity/Coupon";
import faker from "faker";

export default async function createCouponHelper() {
  return Coupon.create({
    key: faker.random.alphaNumeric(6).toUpperCase(),
    couponUse: faker.random.number(10),
    discountAmount: faker.random.number(100),
    discountPercent: faker.random.number({max: 10, min: 0.1, precision: 2}),
    discountType: (faker.random.number({min: 1, max: 2}) % 2 === 0)? "amount": "percent",
    dateBegin: faker.date.past().toDateString(),
    dateEnd: faker.date.future().toDateString(),
    name: faker.company.bsBuzz()
  }).save();
}
