import {config, createSchema} from '@keystone-next/keystone/schema';
import { User } from './schemas/User';
import 'dotenv/config';

const databaseURL = process.env.DATABASE_URL || 'mongodb://localhost/';

const sessionConfig = {
  maxAge: 60 * 60 * 24 * 360, // how long should they stay signed in
  secret: process.env.COOKIE_SECRET,
};

export default config({
  server: {
    cors: {
      origin: [process.env.FRONTEND_URL],
      credentials: true,
    },
  },
  db: {
    adapter: 'mongoose',
    url: databaseURL,
    // TODO add data seeding here
  },
  lists: createSchema({
    // schema items here
    User,
  }),
  ui: {
    // TODO change for roles
    isAccessAllowed: () => true,
  },
  // TODO add session values here
});
