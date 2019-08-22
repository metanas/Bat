import {User} from "../../src/entity/User";
import {createUserHelper} from "../helper/createUserHelper";
import {connection} from "../test-utils/connection";
import {Connection} from "typeorm";
import {graphqlCall} from "../test-utils/graphqlCall";
import {createCartHelper} from "../helper/createCartHelper";


describe("Test Cart Resolver",  () => {
  let conn: Connection;
  let user: User;

  beforeAll(async () => {
    conn = await connection();
    user = await createUserHelper();
  });

  afterAll(async () => {
    await conn.close();
  });

  it("Test Getting Cart By UserID", async () => {
    const cart = await createCartHelper(user);

    const getCartQuery = `{
      getCart {
        id
      }
    }`;

    const response = await graphqlCall({
      source: getCartQuery,
      token: user.id
    });



    expect(response).toMatchObject({
      data:{
        getCart : {
          id: `${cart.id}`
        }
      }
    });
  });
  it("Test Delete Cart", async () => {

    const cart = await createCartHelper(user);
    const deleteCartQuery = `mutation { 
      deleteCart(id: ${cart.id}) 
    }`;

    const response = await graphqlCall({
      source: deleteCartQuery,
      token: user.id
    });

    expect(response).toMatchObject({
      data: {
        deleteCart: true
      }
    });
  });
  it("Test Add Cart", async () => {
    const addCartQuery = `mutation {
      addCart(){
      id}
    }`;

    const response = await graphqlCall({
      source: addCartQuery,
      token: user.id
    });
    expect(response).toMatchObject({


  })

  });
  
});

