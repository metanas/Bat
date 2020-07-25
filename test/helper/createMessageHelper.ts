import {Message} from "../../src/entity/Message";
import faker = require("faker");


export async function createMessageHelper(){
 return await Message.create({
   content : faker.random.word(),
 }).save()
}