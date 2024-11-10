import QueueService from "../service/QueueService";
import {getDetail} from "../untils/swagger";
import Redis from "ioredis";
import Queue from "bull";

const MarketController = (app: any) => {


    return app.group("/market", (ctx: any) => {
        ctx.get('test', async () => {
            const queueService = QueueService.getInstance('phamkiencuong');
            return await queueService.addJob({test: 'qweqweqq'});
        }, {
            detail: getDetail("", ["Market"], []),
        })
        return ctx;
    });
};

export default MarketController;
