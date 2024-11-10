import Elysia from "elysia";
import {connectDB} from "./database/db.setup";
import cors from "@elysiajs/cors";
import responseMiddleware from "./middlewate/ResponseMiddleware";
import errorMiddleware from "./middlewate/ErrorMiddleware";
import swagger from "@elysiajs/swagger";
import pirateController from "./controller/PirateController";
import MercenarieController from "./controller/MercenarieController";
import MarketController from "./controller/MarketController";
import TransactionAttackController from "./controller/TransactionAttackController";


const app = new Elysia();

await connectDB();
app.use(cors());
app.use(
    swagger({
        path: "/api-docs",
        documentation: {
            info: {
                title: "cryptopiece",
                version: "1.0.0",
                description: "cryptopiece Elysia API documentation",
            },
            components: {
                securitySchemes: {
                    JwtAuth: {
                        type: "http",
                        scheme: "bearer",
                        bearerFormat: "JWT",
                        description: "Enter JWT Bearer token **_only_**",
                    },
                },
            },
            // @ts-ignore
            swaggerOptions: {
                persistAuthorization: true,
            },
        },
    })
);
app
    .onAfterHandle(responseMiddleware)
    .onError(errorMiddleware)
    .group("/api-v1", (ctx: any) => {
        ctx.use(pirateController)
        ctx.use(MercenarieController)
        ctx.use(MarketController)
        ctx.use(TransactionAttackController)
        return ctx;
    });
app.get("/", async () => {
    return "Hello World";
});
app.listen(Bun.env.PORT || 8888);
console.log(`🦊 Elysia is running ${app.server?.port}`);
