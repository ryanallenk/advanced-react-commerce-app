import { integer, relationship, text, virtual } from '@keystone-next/fields';
import { list } from '@keystone-next/keystone/schema';

export const Order = list({
  // TO DO
  // access:,
  fields: {
    label: virtual({
      graphQLReturnType: 'String',
      resolver(item) {
        return 'Order';
      },
    }),
    total: integer(),
    items: relationship({ ref: 'OrderItem.order', many: true }),
    user: relationship({ ref: 'User.orders' }),
    charge: text(),
  },
});
