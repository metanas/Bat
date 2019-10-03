import {createCostumerHelper} from "../../helper/createCostumerHelper";
import {Costumer} from "../../../src/entity/Costumer";
import {connection} from "../../test-utils/connection";
import {Connection} from "typeorm";
import {graphqlCall} from "../../test-utils/graphqlCall";
import {take} from "lodash";
import {truncate} from "../../helper/truncateTables";
import {createMessageHelper} from "../../helper/createMessageHelper";

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

  it("Test Add Message", async () => {

    const addMessageQuery = `mutation {
      addMessage(content: "testTest",byAdmin: false) {
        content
        byAdmin
      }
    }`;

    const response = await graphqlCall({
      source: addMessageQuery,
      user: costumer
    });

    expect(response).toMatchObject({
      data: {
        addMessage: {
          content: "testTest",
          byAdmin: false
        }
      }
    });
  });


  it("Test Get Messages", async () => {
    await truncate(conn, "message");
    const messageList: { id: string  }[] = [];

    for(let i=0; i< 22; i++) {
      const message = await createMessageHelper();
      messageList.push({ id : message.id.toString() });
    }

    const getMessagesQuery = `{
      getMessages(page: 1, limit: 10) {
        items {
          id
        }
        total_pages
        total_count
      }
    }`;

    const response = await graphqlCall({
      source: getMessagesQuery,
      user : costumer

    });

    expect(response).toMatchObject({
      data: {
        getMessages: {
          items: take(messageList, 10),
          "total_pages": 3,
          "total_count": 22
        }
      }
    })
  });

});