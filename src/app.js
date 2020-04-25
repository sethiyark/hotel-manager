import Koa from "koa";
import Router from "koa-router";

const koa = new Koa();
const app = new Router();

app.get("/", async (ctx) => {
  ctx.body = "Test App";
});

koa.use(app.routes());
const server = koa.listen(3000, () => {
  const address = server.address();
  const url = `http://${address.address}:${address.port}`;
  console.log(`Server listening on ${url}`);
});
