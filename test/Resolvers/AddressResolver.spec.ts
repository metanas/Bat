import {Connection} from "typeorm";
import {connection} from "../test-utils/connection";
import {User} from "../../src/entity/User";
import faker = require("faker");
import {graphqlCall} from "../test-utils/graphqlCall";
import {Address} from "../../src/entity/Address";
import { take, get, slice } from "lodash";
import {createUserHelper} from "../helper/createUserHelper";
import {truncate} from "../helper/truncateTables";
import {createAddressHelper} from "../helper/createAddressHelper";

let conn: Connection;
let user: User;

beforeAll(async () => {
  conn = await connection();
});

afterAll(async () => {
  await conn.close();
});

beforeEach(async () => {
  await truncate(conn);
  user = await createUserHelper();
});

describe("Test Address Resolver",  () => {
  it("Test Getting Address By ID", async () => {
    const address = await createAddressHelper(user);

    const getAddressQuery = `{
      getAddress(id: ${address.id}) { 
        id
        address
        longitude
        latitude
      }    
    }`;

    const response = await graphqlCall({
      source: getAddressQuery,
      token: user.id
    });

    expect(response).toMatchObject({
      data: {
        getAddress: {
          id: `${address.id}`,
          address: address.address,
          longitude: address.longitude,
          latitude: address.latitude,
        }
      }
    });
  });

  it("Test Add Address", async () => {

    const addAddressQuery = `mutation {
      addAddress(address: "test address", longitude: "1.23423423", latitude: "3.12319221") {
        address
        longitude
        latitude
      }
    }`;

    const response = await graphqlCall({
      source: addAddressQuery,
      token: user.id
    });

    expect(response).toMatchObject({
      data: {
        addAddress: {
          address: "test address",
          longitude: "1.23423423",
          latitude: "3.12319221"
        }
      }
    });
  });

  it("Test Get Addresses", async () => {
    let getAddressesQuery = `{
      getAddresses(data: { limit: 5, page: 1 }) {
        items {
          address
        }
        total_pages
        total_count
      }
    }`;

    const listAddress: { address: string }[] = [];
    for(let i=0; i < 12; i++) {
      const address = await createAddressHelper(user);
      listAddress.push({ address: address.address });
    }

    let response = await graphqlCall({
      source: getAddressesQuery,
      token: user.id
    });

    expect(get(response.data, "getAddresses.items")).toEqual(take(listAddress, 5));
    expect(get(response.data, "getAddresses.total_pages")).toEqual(3);
    expect(get(response.data, "getAddresses.total_count")).toEqual(12);

    getAddressesQuery = `{
      getAddresses(data: { limit: 5, page: 2 }) {
        items {
          address
        }
        total_pages
        total_count
      }
    }`;

    response = await graphqlCall({
      source: getAddressesQuery,
      token: user.id
    });

    expect(get(response.data, "getAddresses.items")).toEqual(slice(listAddress, 5, 10));
    expect(get(response.data, "getAddresses.total_pages")).toEqual(3);
    expect(get(response.data, "getAddresses.total_count")).toEqual(12);

    getAddressesQuery = `{
      getAddresses(data: { limit: 5, page: 3 }) {
        items {
          address
        }
        total_pages
        total_count
      }
    }`;

    response = await graphqlCall({
      source: getAddressesQuery,
      token: user.id
    });

    expect(get(response.data, "getAddresses.items")).toEqual(slice(listAddress, 10, 12));
  });

  it("Test Delete Address", async () => {
    const address = await createAddressHelper(user);

    const deleteAddressQuery = `mutation { 
      deleteAddress(id: ${address.id}) 
    }`;

    const response = await graphqlCall({
      source: deleteAddressQuery,
      token: user.id
    });

    expect(response).toMatchObject({
      data: {
        deleteAddress: true
      }
    });
    await truncate(conn);
  });

  it("Test Update Address", async () => {

    const address = await Address.create({
      address: faker.address.streetName(),
      latitude: faker.address.latitude(),
      longitude: faker.address.longitude(),
      user: user
    }).save();

    const updateAddressQuery = `mutation { 
      updateAddress(id: ${address.id}, address: "${faker.address.streetName()}", longitude: "${faker.address.longitude()}", latitude: "${faker.address.latitude()}") {
        id
        address
        longitude
        latitude
      } 
    }`;

    const response = await graphqlCall({
      source: updateAddressQuery,
      token: user.id
    });

    expect(get(response.data,"updateAddress.id")).toEqual(`${address.id}`);
    expect(get(response.data,"updateAddress.address")).not.toEqual(address.address);
    expect(get(response.data,"updateAddress.longitude")).not.toEqual(address.longitude);
    expect(get(response.data,"updateAddress.latitude")).not.toEqual(address.latitude);
  });
});
