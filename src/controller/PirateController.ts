import {getDetail} from "../untils/swagger";
import PirateService from "../service/PirateService";
import {buyCoinDto, requestAddress, UpdateTeam, useCoinDto} from "../schema/dto";

const pirateService = PirateService.getInstance()

const PirateController = (app: any) => {
    return app.group("/pirate", (ctx: any) => {

        ctx.post("/", async ({body}: any) => {
            const {address} = body;
            return await pirateService.createPirate(address.toLowerCase());
        }, {
            body: requestAddress,
            detail: getDetail("post pirate ", ["pirate"], []),
        });

        ctx.get("/", async ({query}: any) => {
            const {address} = query;
            return await pirateService.getPirate(address.toLowerCase());
        }, {
            query: requestAddress,
            detail: getDetail("post pirate ", ["pirate"], []),
        });

        ctx.get("/getDetailReward", async ({query}: any) => {
            const {address} = query;
            return await pirateService.detailReward(address.toLowerCase());
        }, {
            query: requestAddress,
            detail: getDetail("get detail reward", ["pirate"], []),
        });

        ctx.post("/updateTeam", async ({body}: any) => {
            const {address, mercSelected, dataThatWasSigned, signature} = body;
            return await pirateService.updateTeamAttack(address.toLowerCase(), mercSelected, dataThatWasSigned, signature);
        }, {
            body: UpdateTeam,
            detail: getDetail("update team", ["pirate"], []),
        });

        ctx.get("/useOCoin", async ({query}: any) => {
            const {address, dataThatWasSigned, signature} = query;
            return await pirateService.use0Coin(address.toLowerCase(), dataThatWasSigned, signature);
        }, {
            query: useCoinDto,
            detail: getDetail("use 0 Coin", ["pirate"], []),
        });

        ctx.get("/useBCoin", async ({query}: any) => {
            const {address, dataThatWasSigned, signature} = query;
            return await pirateService.useBCoin(address.toLowerCase(), dataThatWasSigned, signature);
        }, {
            query: useCoinDto,
            detail: getDetail("use B Coin", ["pirate"], []),
        });

        ctx.post("/buyLuckyCoin", async ({body}: any) => {
            const {address, hash} = body;
            return await pirateService.buyLuckyCoin(address.toLowerCase(), hash);
        }, {
            body: buyCoinDto,
            detail: getDetail("lucky coin", ["pirate"], []),
        });

        ctx.post("/buyOri", async ({body}: any) => {
            const {address, hash} = body;
            return await pirateService.buyOriCoin(address.toLowerCase(), hash);
        }, {
            body: buyCoinDto,
            detail: getDetail("buy ori", ["pirate"], []),
        });
        return ctx;
    });
};

export default PirateController;