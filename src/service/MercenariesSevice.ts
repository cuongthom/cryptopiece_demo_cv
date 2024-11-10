import {
    checkOwnerOfMerNumber,
    contractMarket, contractOwner,
    provider,
} from "../untils";
import {ethers} from "ethers";
import IMercenaries from "../schema/MercenarieSchema";
import transactionHashSchema from "../schema/TransactionHashSchema";
import QueueService from "./QueueService";
import PirateService from "./PirateService";
import IPirate from "../schema/PirateSchema";

const pirateService = PirateService.getInstance();

class MercenariesService {
    public static instance: MercenariesService;

    static getInstance() {
        if (!MercenariesService.instance) {
            MercenariesService.instance = new MercenariesService();
        }
        return MercenariesService.instance;
    }

    async updateTeam(address: string, mercSelected: any) {
        const pirate = await IPirate.findOne({address}) as any;
        if (pirate.numberOfUpdates <= 0) {
            throw new Error("You ran out of updates for today.")
        }
        await IPirate.updateOne({address}, {numberOfUpdates: pirate.numberOfUpdates - 1})
        return IPirate.updateOne({address}, {mercSelected})
    }

    async getMercToMarketByAddress(address: string) {
        const res = await contractOwner.list(address)
        const allToken = []
        for (let i = 0; i < res.length; i++) {
            const token = Number(ethers.utils.formatUnits(res[i], 0))
            allToken.push(token);
        }
        return allToken;
    }

    async convertPriceMerc(mercenarieList: any) {
        const newMercenariesList = [];
        for (let i = 0; i < mercenarieList.length; i++) {
            const convertNumber = ethers.utils.formatUnits(mercenarieList[i][2].toString(), 0)
            const convertPrice = ethers.utils.formatUnits(mercenarieList[i][1].toString(), 18)
            const element = {
                address: mercenarieList[i][0],
                number: Number(convertNumber),
                price: Number(convertPrice),
            };
            newMercenariesList.push(element);
        }
        return newMercenariesList;
    }

    async convertBignumber(mercenariesList: any) {
        const newMercenariesList = [];
        for (let i = 0; i < mercenariesList.length; i++) {
            const bigNumber = ethers.utils.formatUnits(mercenariesList[i][2].toString(), 0)
            newMercenariesList.push(Number(bigNumber))
        }
        return newMercenariesList;
    }

    async saveTransactionReceipt(getTransactionFromProvider: any, hash: string) {
        const findTransaction = await transactionHashSchema.findOne({transactionHash: hash})
        if (findTransaction) return
        await transactionHashSchema.create({
            transactionHash: getTransactionFromProvider.transactionHash,
            blockHash: getTransactionFromProvider.blockHash,
            blockNumber: getTransactionFromProvider.blockNumber,
            from: getTransactionFromProvider.from,
            to: getTransactionFromProvider.to,
            type: "AwardEgg",
        })
    }

    async getMerByAddress(address: string) {
        const getMerListByAddress = await pirateService.getMerToHex(address) as any;
        if (!getMerListByAddress) {
            throw new Error("please buy mercenary!")
        }
        return IMercenaries.find({
            number: {$in: getMerListByAddress},
            isDetached: false,
        }).sort({number: -1});

    }

    async getMercenariesByHash(address: string, hash: string) {
        try {
            const transaction = await transactionHashSchema.findOne({transactionHash: hash})
            const getTransactionFromProvider = await provider.getTransactionReceipt(hash)
            await this.saveTransactionReceipt(getTransactionFromProvider, hash)
            const transactionLogs = getTransactionFromProvider.logs;
            const topicArr = [];
            for (let i = 0; i < transactionLogs.length; i++) {
                const number = Number(
                    ethers.utils.formatUnits(
                        transactionLogs[i].topics[transactionLogs[i].topics.length - 1],
                        0,
                    ),
                );
                topicArr.push(number);
            }
            return topicArr[0]
        } catch (err: any) {
            throw new Error(err.message)
        }
    }

    async getAllMercenariesInMarket() {
        try {
            const listMercenariesMarket = await contractMarket.functions['getStakedNft()']();
            const convertBigNumber = await this.convertBignumber(listMercenariesMarket[0])
            const priceMercArr = await this.convertPriceMerc(listMercenariesMarket[0])
            const mercenariesMarket = await IMercenaries.find({
                number: {$in: convertBigNumber},
                isDetached: false,
            }).sort({number: -1})
            return {
                mercArr: mercenariesMarket,
                priceMercArr
            }
        } catch (err: any) {
            throw new Error(err.message)
        }
    }

    async checkHitsOfMercenaries(number: number) {
        const merc = await IMercenaries.findOne({number}) as IMercenaries;
        if (!merc) throw new Error("please buy mercenary!");
        if (merc.max_battle_over_one_day <= 0) throw new Error("You have reached the limit of attacks");
        return {hitsAttack: merc.max_battle_over_one_day}
    }

    async detached(address: string, number: number, type: string, dataThatWasSigned: string, signature: string) {
        const recoverPerson = await pirateService.recoverPersonalAddress(
            dataThatWasSigned,
            signature
        );
        if (recoverPerson.toLowerCase() !== address.toLowerCase()) throw new Error("Signature data does not match address.");
        const merc = await IMercenaries.findOne({number}) as IMercenaries;
        if (!merc) throw new Error("Mercenaries not found");
        if (merc.isDetached) throw new Error("Mercenaries is detached");
        const queueService = QueueService.getInstance('detached');
        return await queueService.addJob({
            address,
            merNumber: number,
            type,
            dataThatWasSigned,
            signature,
        });
    }

    async startUp(address: string, listMer: any, hash: string) {
        const res = await this.getMercToMarketByAddress(address)
        const tokenFind = res.filter((item) => listMer.includes(item))
        if (tokenFind.length !== 2) {
            throw new Error("Please choose 2 merc to update")
        }
        const queueService = QueueService.getInstance('addToQueueStartUp');
        return await queueService.addJob({address, listMer, hash});
    }

    async levelUp(address: string, merNumber: number, hash: string) {
        const res = await IMercenaries.findOne({merNumber}) as any
        if (!!res.isDetached) throw new Error("Merc is detached.")
        const addressToMerc = await checkOwnerOfMerNumber(merNumber) as any
        if (addressToMerc !== address) throw new Error("Merc is not of address")
        const queueService = QueueService.getInstance('addToQueueLevelUp');
        return await queueService.addJob({address, merNumber, hash});
    }

    async attackRound(address: string, mercNumber: number, difficulty: number, dataThatWasSigned: string, signature: string) {
        const recoverPerson = await pirateService.recoverPersonalAddress(
            dataThatWasSigned,
            signature
        );
        if (recoverPerson.toLowerCase() !== address.toLowerCase()) throw new Error("Signature data does not match address.");
        if (mercNumber <= 0) throw new Error("Invalid Merc. Please try again later.");
        if (![1, 2, 3, 4].includes(difficulty)) throw new Error("Difficulty incorrect format.");
        try {
            const res = await IMercenaries.findOne({number: mercNumber}) as any;
            console.log("res.isDetached", res.isDetached)
            console.log("1")
            if (res.isDetached === true) new Error("Merc is detached.");
            const checkMerc = await checkOwnerOfMerNumber(mercNumber) as any;
            if (checkMerc.toLowerCase() !== address.toLowerCase()) new Error("Merc is detached.");
            // const queueService = QueueService.getInstance('addToQueueAttack');
            // return await queueService.addJob({address, mercNumber, difficulty, dataThatWasSigned, signature});
        } catch (error: any) {
            console.error(error);
            throw new Error(error.message);
        }
    }

    async speedBattle(address: string, difficulty: number, dataThatWasSigned: string, signature: string) {
        try {
            const allMerc = await this.getMercToMarketByAddress(address)
            const pirate = await IPirate.findOne({address}) as any
            const tokenFind = allMerc.filter((item) => pirate.mercSelected.includes(item))
            if (tokenFind.length !== pirate.mercSelected.length) {
                await this.updateTeam(address, [])
            }
            const queueService = QueueService.getInstance('addToQueueSpeedAttack');
            return await queueService.addJob({address, difficulty, dataThatWasSigned, signature});
        } catch (error: any) {
            throw new Error(error.message)
        }

    }
}

export default MercenariesService;