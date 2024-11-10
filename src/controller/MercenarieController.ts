import {getDetail} from "../untils/swagger";
import {t} from "elysia"

import MercenariesService from "../service/MercenariesSevice";
import IMercenaries from "../schema/MercenarieSchema";
import {
    attackDto,
    getHitOfMerc,
    getMercInArr,
    levelUpDto,
    requestAddress,
    rqDetached,
    speedBattleDto,
    startUpDto
} from "../schema/dto";


const mercenariesService = MercenariesService.getInstance()

const MercenariesController = (app: any) => {
    return app.group("/mercenaries", (ctx: any) => {
        ctx.get(
            "",
            async ({query}: any) => {
                const {address} = query;
                return await mercenariesService.getMerByAddress(address.toLowerCase())
            },
            {
                query: requestAddress,
                detail: getDetail("get mercenaries list by address", ["mercenaries"], []),
            }
        );
        ctx.get(
            "/mercByAddress",
            async ({query}: any) => {
                const {address,} = query;
                return await mercenariesService.getMerByAddress(address.toLowerCase());
            },
            {
                query: requestAddress,
                detail: getDetail("get mercenaries list by address", ["mercenaries"], []),
            }
        );


        ctx.get(
            "/getMercInNumArr",
            async ({query}: any) => {
                const {address, hash} = query;
                const numberMerc = await mercenariesService.getMercenariesByHash(address.toLowerCase(), hash)
                if (!numberMerc) {
                    throw new Error("Mercenaries invalid hash");
                }
                return IMercenaries.findOne({number: numberMerc});
            },
            {
                query: getMercInArr,
                detail: getDetail("get mercenaries list by hash", ["mercenaries"], []),
            }
        );
        ctx.get(
            "/getAllMercInMarket",
            async () => {
                return await mercenariesService.getAllMercenariesInMarket();
            },
            {
                detail: getDetail("get mercenaries list by market", ["mercenaries"], []),
            }
        );


        ctx.post(
            "/getHitsOfMercenaries",
            async ({body}: any) => {
                let {number} = body;
                return await mercenariesService.checkHitsOfMercenaries(number)
            },
            {
                body: getHitOfMerc,
                detail: getDetail("get hits of mercenaries", ["mercenaries"], []),
            }
        );

        ctx.post(
            "/detached",
            async ({body}: any) => {
                const {address, merNumber, type, signature, dataThatWasSigned} = body;
                return await mercenariesService.detached(address.toLowerCase(), merNumber, type, dataThatWasSigned, signature);
            },
            {
                body: rqDetached,
                detail: getDetail("detached", ["mercenaries"], []),
            }
        );

        ctx.post(
            "/startUp",
            async ({body}: any) => {
                const {address, listMer, hash} = body;
                return await mercenariesService.startUp(address.toLowerCase(), listMer, hash);
            },
            {
                body: startUpDto,
                detail: getDetail("startUp", ["mercenaries"], []),
            }
        );

        ctx.post(
            "/levelUp",
            async ({body}: any) => {
                const {address, merNumber, hash} = body;
                return await mercenariesService.levelUp(address.toLowerCase().toLowerCase(), merNumber, hash);
            },
            {
                body: levelUpDto,
                detail: getDetail("levelUp", ["mercenaries"], []),
            }
        );

        ctx.post(
            "/attack",
            async ({body}: any) => {
                const {address, mercNumber, difficulty, dataThatWasSigned, signature} = body;
                return await mercenariesService.attackRound(address.toLowerCase(), mercNumber, difficulty, dataThatWasSigned, signature);
            },
            {
                body: attackDto,
                detail: getDetail("attack", ["mercenaries"], []),
            }
        );

        ctx.post(
            "/speedBattle",
            async ({body}: any) => {
                const {address, difficulty, dataThatWasSigned, signature} = body;
                console.log("hi")
                return await mercenariesService.speedBattle(address, difficulty, dataThatWasSigned, signature);
            },
            {
                body: speedBattleDto,
                detail: getDetail("speed battle", ["mercenaries"], []),
            }
        );

        return ctx;
    });
};

export default MercenariesController;
