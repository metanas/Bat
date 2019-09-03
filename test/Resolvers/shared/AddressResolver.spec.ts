import {Connection} from "typeorm";
import {connection} from "../../test-utils/connection";
import {Costumer} from "../../../src/entity/Costumer";
import faker from "faker";
import {graphqlCall} from "../../test-utils/graphqlCall";
import {Address} from "../../../src/entity/Address";
import {get, slice, take} from "lodash";
import {createCostumerHelper} from "../../helper/createCostumerHelper";
import {createAddressHelper} from "../../helper/createAddressHelper";

describe("Test Address Resolver",  () => {
  let conn: Connection;
  let costumer: Costumer;

  beforeAll(async () => {
    conn = await connection();
    costumer = await createCostumerHelper();
  });

  afterAll(async () => {
    await conn.close();
  });

  it("Test Getting Address By ID", async () => {
    const address = await createAddressHelper(costumer);

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
      user: costumer
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
      user: costumer
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
    costumer = await createCostumerHelper();

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
      const address = await createAddressHelper(costumer);
      listAddress.push({ address: address.address });
    }

    let response = await graphqlCall({
      source: getAddressesQuery,
      user: costumer
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
      user: costumer
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
      user: costumer
    });

    expect(get(response.data, "getAddresses.items")).toEqual(slice(listAddress, 10, 12));
  });

  it("Test Delete Address", async () => {
    const address = await createAddressHelper(costumer);

    const deleteAddressQuery = `mutation { 
      deleteAddress(id: ${address.id}) 
    }`;

    const response = await graphqlCall({
      source: deleteAddressQuery,
      user: costumer
    });

    expect(response).toMatchObject({
      data: {
        deleteAddress: true
      }
    });
  });

  it("Test Update Address", async () => {

    const address = await Address.create({
      address: faker.address.streetName(),
      latitude: faker.address.latitude(),
      longitude: faker.address.longitude(),
      costumer: costumer
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
      user: costumer
    });

    expect(get(response.data,"updateAddress.id")).toEqual(`${address.id}`);
    expect(get(response.data,"updateAddress.address")).not.toEqual(address.address);
    expect(get(response.data,"updateAddress.longitude")).not.toEqual(address.longitude);
    expect(get(response.data,"updateAddress.latitude")).not.toEqual(address.latitude);
  });
});
