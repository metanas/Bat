import {graphqlCall} from "../../test-utils/graphqlCall";
import {connection} from "../../test-utils/connection";
import {Connection} from "typeorm";
import faker from "faker";
import {createDriverHelper} from "../../helper/createDriverHelper";
import {take} from "lodash";
import {Driver} from "../../../src/entity/Driver";
import {createCostumerHelper} from "../../helper/createCostumerHelper";
import {Costumer} from "../../../src/entity/Costumer";
import {truncate} from "../../helper/truncateTables";
describe("Test Driver Resolver",  () => {
  let conn: Connection;
  let driver : Driver ;
  let user: Costumer;


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
  it("Test Get Drivers", async () => {
    await truncate(conn, "driver");
    const driverList: { id : string  }[] = [];

    for(let i=0; i< 22; i++) {
      const driver = await createDriverHelper();
      driverList.push({ id : driver.id.toString() });
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
      isAdmin : true ,
      user : user

    });
    console.log(response.errors);

    expect(response).toMatchObject({
      data: {
        getDrivers: {
          items: take(driverList, 10),
          "total_pages": 3,
          "total_count": 22
        }
      }
    })
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
  it("Test Getting Driver", async () => {
    driver = await createDriverHelper();
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
      isAdmin:true
    });


    expect(response).toMatchObject({
      data:{
        getDriver : {
          id : `${driver.id}`,
          name: driver.name,
          telephone: driver.telephone,
          point: driver.point,
          isActive: driver.isActive,
          longitude: driver.longitude,
          latitude: driver.latitude,

        }
      }
    });
  });



});