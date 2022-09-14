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
  console.log(charge);
  // 4. convert the cartItems to OrderItems
  const orderItems = cartItems.map(cartItem => {
    const orderItem = {
      name: cartItem.product.name,
      description: cartItem.product.description,
      price: cartItem.product.price,
      quantity: cartItem.quantity,
      photo: { connect: {id: cartItem.product.photo.id}},
    }
    return orderItem;
  }) 
  // 5. create the order and return it
  const order = await context.lists.Order.createOne({
    data: {
      total: charge.amount,
      charge: charge.id,
      items: { create: orderItems },
      user: { connect: { id: userId }},
    }
  });
  // 6. clean up any old cart items
  const cartItemIds = user.cart.map(cartItem => cartItem.id);
  await context.lists.CartItem.deleteMany({
    ids: cartItemIds
  });
  return order;
}

export default checkout;
