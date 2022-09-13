import {
  CartItemCreateInput,
  OrderCreateInput,
} from '../.keystone/schema-types';
/* eslint-disable */
import { KeystoneContext, SessionStore } from '@keystone-next/types';
import stripeConfig from '../lib/stripe';

interface Arguments {
  token: string
}

async function checkout(
  root: any,
  { token }: Arguments,
  context: KeystoneContext
): Promise<OrderCreateInput>  {
  // 1. make sure user is signed in
  const userId = context.session.itemId;
  if(!userId) {
    throw new Error('Sorry! You must be signed in to create an order.')
  }
  // 2. calculate the total price of order
  const user = await context.lists.User.findOne({
    where: { id: userId },
    resolveFields: `
    id
    name
    email
    cart {
      id
      quantity
      product {
        name
        price
        description
        id
        photo {
          id
          image {
            id 
            publicUrlTransformed
          }
        }
      }
    }
    `
  })
  console.log(user);
  const cartItems = user.cart.filter(cartItem => cartItem.product);
  const amount = cartItems.reduce(function(tally: number, cartItem: CartItemCreateInput){
    return tally + cartItem.quantity * cartItem.product.price;
  }, 0);
  console.log(amount); 
  // 3. create the charge with stripe library
  const charge = await stripeConfig.paymentIntents.create({
    amount,
    currency: 'CAD',
    confirm: true,
    payment_method: token,
  }).catch(err => {
    console.log(err);
    throw new Error(err.message)
  });
  // 4. convert the cartItems to OrderItems 
  // 5. create the order and return it
}

export default checkout;
