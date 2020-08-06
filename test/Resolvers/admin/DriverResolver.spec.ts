import { graphqlCall } from "../../test-utils/graphqlCall";
import { connection } from "../../test-utils/connection";
import { Connection } from "typeorm";
import * as faker from "faker";
import { createDriverHelper } from "../../helper/createDriverHelper";
import { take } from "lodash";
import { Driver } from "../../../src/entity/Driver";
import { createCostumerHelper } from "../../helper/createCostumerHelper";
import { truncate } from "../../helper/truncateTables";
import { createOrderHelper } from "../../helper/createOrderHelper";
import { createAddressHelper } from "../../helper/createAddressHelper";
import { GraphQLError } from "graphql";
import { createUserGroupHelper } from "../../helper/createUserGroupHelper";
import { createUserHelper } from "../../helper/createUserHelper";
import { loginHelper } from "../../helper/loginHelper";

describe("Test Driver Resolver", () => {
  let conn: Connection;
  let driver: Driver;

  beforeAll(async () => {
    conn = await connection();
  });

  afterAll(async () => {
    await conn.close();
  });

  it("Test Add Driver", async () => {
    const userGroup = await createUserGroupHelper();
    const user = await createUserHelper(userGroup);

    const token = await loginHelper(user);
    const newDriver = {
      name: faker.name.findName(),
      telephone: faker.phone.phoneNumber(),
      point: faker.random.number(5),
      avatar: faker.random.word(),
      latitude: faker.address.latitude(),
      longitude: faker.address.longitude(),
    };

    const addDriverQuery = `mutation {
      addDriver(name:"${newDriver.name}",telephone:"${newDriver.telephone}", point:${newDriver.point}, avatar:"${newDriver.avatar}", isActive: false, longitude:"${newDriver.longitude}",latitude:"${newDriver.latitude}") {
        name
        telephone
        point
        avatar
        isActive
        longitude
        latitude
      }
    }`;
    const response = await graphqlCall({
      source: addDriverQuery,
      user,
      token,
      isAdmin: true,
    });
    expect(response).toMatchObject({
      data: {
        addDriver: {
          name: newDriver.name,
          telephone: newDriver.telephone,
          point: newDriver.point,
          avatar: newDriver.avatar,
          isActive: false,
          longitude: newDriver.longitude,
          latitude: newDriver.latitude,
        },
      },
    });
  });
  it("Test Delete Driver", async () => {
    const driver = await createDriverHelper();
    const userGroup = await createUserGroupHelper();
    const user = await createUserHelper(userGroup);

    const token = await loginHelper(user);

    const deleteDriverQuery = `mutation { 
      deleteDriver(id: ${driver.id}) 
    }`;

    const response = await graphqlCall({
      source: deleteDriverQuery,
      isAdmin: true,
      token,
      user,
    });

    expect(response).toMatchObject({
      data: {
        deleteDriver: true,
      },
    });
  });
  it("Test Get Drivers", async () => {
    await truncate(conn, "driver");
    const driverList: { id: string }[] = [];
    const userGroup = await createUserGroupHelper();
    const user = await createUserHelper(userGroup);

    const token = await loginHelper(user);
    for (let i = 0; i < 22; i++) {
      const driver = await createDriverHelper();
      driverList.push({ id: driver.id.toString() });
    }

    const getDriversQuery = `{
      getDrivers(page: 1, limit: 10) {
        items {
          id
        }
        total_pages
        total_count
      }
    }`;

    const response = await graphqlCall({
      source: getDriversQuery,
      isAdmin: true,
      user,
      token,
    });

    expect(response).toMatchObject({
      data: {
        getDrivers: {
          items: take(driverList, 10),
          total_pages: 3,
          total_count: 22,
        },
      },
    });
  });
  it("Test Update Driver Status", async () => {
    const userGroup = await createUserGroupHelper();
    const user = await createUserHelper(userGroup);

    const token = await loginHelper(user);
    driver = await createDriverHelper();
    const updateDriverStatusQuery = `mutation {
      updateDriverStatus(id: ${driver.id}, isActive: false) {
        id
        isActive
      }
    }`;

    const response = await graphqlCall({
      source: updateDriverStatusQuery,
      user: user,
      isAdmin: true,
      token,
    });

    expect(response).toMatchObject({
      data: {
        updateDriverStatus: {
          id: `${driver.id}`,
          isActive: false,
        },
      },
    });
  });
  it("Test Update Driver", async () => {
    driver = await createDriverHelper();
    const userGroup = await createUserGroupHelper();
    const user = await createUserHelper(userGroup);

    const token = await loginHelper(user);
    const updateDriverQuery = `mutation {
      updateDriver(id: ${driver.id} ,name:"setfsd",telephone:"4567461", point:3, avatar:"srfg", longitude:"5243",latitude:"245") {
        name
        telephone
        point
        avatar
        longitude
        latitude
      }
    }`;

    const response = await graphqlCall({
      source: updateDriverQuery,
      user,
      token,
      isAdmin: true,
    });
    expect(response).toMatchObject({
      data: {
        updateDriver: {
          name: "setfsd",
          telephone: "4567461",
          point: 3,
          avatar: "srfg",
          longitude: "5243",
          latitude: "245",
        },
      },
    });
  });
  it("Test Getting Driver", async () => {
    driver = await createDriverHelper();
    const userGroup = await createUserGroupHelper();
    const user = await createUserHelper(userGroup);

    const token = await loginHelper(user);
    const getDriverQuery = `{
      getDriver (id: ${driver.id}){
        id
        name
        telephone
        point
        isActive
        longitude
        latitude
      }
    }`;

    const response = await graphqlCall({
      source: getDriverQuery,
      user: user,
      isAdmin: true,
      token,
    });

    expect(response).toMatchObject({
      data: {
        getDriver: {
          id: `${driver.id}`,
          name: driver.name,
          telephone: driver.telephone,
          point: driver.point,
          isActive: driver.isActive,
          longitude: driver.longitude,
          latitude: driver.latitude,
        },
      },
    });
  });

  it("Test set Driver To Order", async () => {
    const customer = await createCostumerHelper();
    const address = await createAddressHelper(customer);
    const order = await createOrderHelper(address, customer, 3);
    const driver = await createDriverHelper();
    const userGroup = await createUserGroupHelper();
    const user = await createUserHelper(userGroup);

    const token = await loginHelper(user);
    let setDriverToOrderQuery = `mutation {
       setDriverToOrder(id: ${driver.id}, orderId: "${order.id}") {
         id
         driverName
       }
     }`;

    let response = await graphqlCall({
      source: setDriverToOrderQuery,
      isAdmin: true,
      user,
      token,
    });

    expect(response).toMatchObject({
      data: {
        setDriverToOrder: {
          id: order.id,
          driverName: driver.name,
        },
      },
    });

    setDriverToOrderQuery = `mutation {
       setDriverToOrder(id: 907, orderId: "${order.id}") {
         id
         driverName
       }
     }`;

    response = await graphqlCall({
      source: setDriverToOrderQuery,
      isAdmin: true,
      user,
    });

    expect(response.errors).toEqual([new GraphQLError("Driver Not Found!")]);
  });
});
