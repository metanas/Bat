import {Product} from "../../src/entity/Product";
import {Costumer} from "../../src/entity/Costumer";
import {Favourite} from "../../src/entity/Favourite";


export async function createFavouriteHelper(costumer:Costumer,product: Product) {
  return await Favourite.create({
    costumer,
    product}).save();}