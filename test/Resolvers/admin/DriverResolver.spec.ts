import {graphqlCall} from "../../test-utils/graphqlCall";
import {connection} from "../../test-utils/connection";
import {Connection} from "typeorm";
import faker from "faker";
import {createDriverHelper} from "../../helper/createDriverHelper";
import {  get,slice,take} from "lodash";
import {Driver} from "../../../src/entity/Driver";
import {createCostumerHelper} from "../../helper/createCostumerHelper";
import {Costumer} from "../../../src/entity/Costumer";
import {createAddressHelper} from "../../helper/createAddressHelper";
import {createOrderHelper} from "../../helper/createOrderHelper";
import {Address} from "../../../src/entity/Address";
describe("Test Driver Resolver",  () => {
  let conn: Connection;
  let driver : Driver ;
  let user: Costumer;
  let address : Address;

  beforeAll(async () => {
    conn = await connection();
    user = await createCostumerHelper();

  });

  afterAll(async () => {
    await conn.close();
  });


  it("Test Add Driver", async () => {

    const newDriver = {name : faker.name.findName(),
      telephone : faker.phone.phoneNumber(),
      point : faker.random.number(5),
      avatar : faker.random.word(),
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
      isAdmin: true
    });
    expect(response).toMatchObject({
      data: {
        addDriver: {
          name: newDriver.name ,
          telephone:newDriver.telephone,
          point:newDriver.point,
          avatar:newDriver.avatar,
          isActive : false,
          longitude:newDriver.longitude,
          latitude:newDriver.latitude
        }
      }
    });

  });
  it("Test Delete Driver", async () => {
    const driver = await createDriverHelper();

    const deleteDriverQuery = `mutation { 
      deleteDriver(id: ${driver.id}) 
    }`;

    const response = await graphqlCall({
      source: deleteDriverQuery,
      isAdmin: true
    });

    expect(response).toMatchObject({
      data: {
        deleteDriver: true
      }
    });
  });
  it.skip("Test Get Drivers", async () => {


    let getDriversQuery = `{
      getDrivers(data: { limit: 5, page: 1 }) {
        items {
          id
        }
        total_pages
        total_count
      }
    }`;

    const listDriver: { id: number }[] = [];

    for(let i=0; i < 12; i++) {
      driver = await createDriverHelper();
      listDriver.push({ id: driver.id });
    }

    let response = await graphqlCall({
      source: getDriversQuery,
      user: user

    });

    expect(get(response.data, "getDrivers.items")).toEqual(take(listDriver, 5));
    expect(get(response.data, "getDrivers.total_pages")).toEqual(3);
    expect(get(response.data, "getDrivers.total_count")).toEqual(12);

    getDriversQuery = `{
      getDrivers(data: { limit: 5, page: 2 }) {
        items {
          id
        }
        total_pages
        total_count
      }
    }`;

    response = await graphqlCall({
      source: getDriversQuery,
      user: user

    });

    expect(get(response.data, "getDrivers.items")).toEqual(slice(listDriver, 5, 10));
    expect(get(response.data, "getDrivers.total_pages")).toEqual(3);
    expect(get(response.data, "getDrivers.total_count")).toEqual(12);

    getDriversQuery = `{
      getDrivers(data: { limit: 5, page: 3 }) {
        items {
          id
        }
        total_pages
        total_count
      }
    }`;

    response = await graphqlCall({
      source: getDriversQuery,
      user: user

    });

    expect(get(response.data, "getDrivers.items")).toEqual(slice(listDriver, 10, 12));
  });
  it("Test Update Driver Status", async () => {
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
      isAdmin: true
    });

    expect(response).toMatchObject({
      data: {
        updateDriverStatus: {
          id: `${driver.id}`,
          isActive: false
        }
      }
    });
  });
  it("Test Update Driver", async () => {
    driver = await createDriverHelper();

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
      isAdmin:true

    });
    expect(response).toMatchObject({
      data: {
        updateDriver: {
          name:"setfsd",
          telephone:"4567461",
          point:3,
          avatar:"srfg",
          longitude:"5243",
          latitude:"245"
        }
      }
    });
  });
  it.skip("Test Getting Driver", async () => {

    driver = await createDriverHelper();

    const orderExpect = [];

    for (let i=0; i < 5; i++) {
      user = await createCostumerHelper();
      address = await createAddressHelper(user);
      await createOrderHelper(address, user, 3);
      orderExpect.push({ driver: { id: driver.id },driverName: driver.name})
    }

    const getDriverQuery = `{
      getDriver {
        orders {
          driver {
            id
          }
          driverName
        } 
      }
    }`;

    const response = await graphqlCall({
      source: getDriverQuery,
      user: user,
      isAdmin:true
    });


    expect(response).toMatchObject({
      data:{
        getDriver : {
          id : `${driver.id}`,
          orders: orderExpect,

        }
      }
    });
  });



});