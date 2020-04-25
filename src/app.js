import Koa from "koa";
import Router from "koa-router";
import mount from "koa-mount";
import graphqlHTTP from "koa-graphql";

import schema from "./graphql/schema";
import connectDB from "./database/connection/connection";

// Establish DB connection. Should be invoked only once.
connectDB();

const koa = new Koa();
const app = new Router();

app.get("/", async (ctx) => {
  ctx.body = "Test App";
});

app.use(
  mount(
    "/graphql",
    graphqlHTTP({
      schema: schema,
      graphiql: true,
    })
  )
);

koa.use(app.routes());
const server = koa.listen(3010, () => {
  const address = server.address();
  const url = `http://${address.address}:${address.port}`;
  console.log(`Server listening on ${url}`);
});
