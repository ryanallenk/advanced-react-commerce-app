/* eslint-disable */
import { KeystoneContext } from '@keystone-next/types';
import { CartItemCreateInput } from '../.keystone/schema-types';
import { Session } from '../types';

export default async function addToCart(
  root: any,
  { productId }: { productId: string },
  context: KeystoneContext
): Promise<CartItemCreateInput> {
  // 1. query current user to see if they are signed in
  const sesh = context.session as Session;
  if (!sesh.itemId) {
    throw new Error('You must be logged in to do this!');
  }
  // 2. query users cart
  const allCartItems = await context.lists.CartItem.findMany({
    where: { user: { id: sesh.itemId }, product: { id: productId } },
    resolveFields: 'id, quantity'
  });
  const [existingCartItem] = allCartItems;
  // 3. see if the current item is in cart
  if (existingCartItem) {
    // 4. if it is increment by one, if it isnt create new item
    return await context.lists.CartItem.updateOne({
      id: existingCartItem.id,
      data: { quantity: existingCartItem.quantity +1 }
    });
  }
  return await context.lists.CartItem.createOne({
    data: {
      product: { connect: {id: productId }},
      user: { connect: { id: sesh.itemId }},
    }
  })
}
