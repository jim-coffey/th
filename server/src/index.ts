// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

import express, { Application } from 'express';
import cookieParser from 'cookie-parser';
import { ApolloServer } from 'apollo-server-express';
import bodyParser from 'body-parser';
import { connectDatabase } from './database';
import { typeDefs, resolvers } from './graphql';
import { mockUploadResponse } from './mock-upload-response';

const port = process.env.PORT;

const mount = async (app: Application) => {
  const db = await connectDatabase();

  app.use(bodyParser.json({ limit: '2mb' }));
  app.use(cookieParser(process.env.SECRET));

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }) => ({ db, req, res }),
  });
  server.applyMiddleware({ app, path: '/api' });

  app.post('/mupload', (_req, res) => res.send(mockUploadResponse));

  app.listen(port);

  console.log(`App listening on port: ${port}`);
};

mount(express());
