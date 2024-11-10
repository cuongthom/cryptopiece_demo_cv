import IPirate from "../schema/PirateSchema";
import transactionAttackSchema from "../schema/TransactionAttackSchema";
import {contractOwner} from "../untils";
import IMercenaries from "../schema/MercenarieSchema";
import {ethers} from "ethers";
import QueueService from "./QueueService";


class PirateService {
    public static instance: PirateService;

    static getInstance() {
        if (!PirateService.instance) {
            PirateService.instance = new PirateService();
        }
        return PirateService.instance;
    }

    public async recoverPersonalAddress(message: string, signature: string) {
        try {
            return ethers.utils.verifyMessage(message, signature);
        } catch (err: any) {
            throw new Error(err.message);
        }
    }

    public async getMerToHex(address: string) {
        const allToken = [];
        try {
            const res = await contractOwner.list(address);
            for (let i = 0; i < res.length; i++) {
                let convert = Number(ethers.utils.formatUnits(res[i], 0))
                allToken.push(convert)
            }
            return allToken
        } catch (err: any) {
            throw new Error(err.message);
        }
    }

    async createPirate(address: string) {
        const pirateExists = await IPirate.exists({address: address.toLowerCase()})
        if (!!pirateExists) {
            throw new Error("pirates existed");
        }
        return await IPirate.create({address});
    }

    async getPirate(address: string) {
        const pirate = await IPirate.findOne({address: address.toLowerCase()})
        if (!pirate) {
            throw new Error("pirate does not exist!");
        }
        return pirate
    }

    async detailReward(address: string) {
        const currentTime = new Date().getTime();
        const rewardInfo = await transactionAttackSchema.aggregate([
            {
                $match: {
                    address: address,
                    withdraw_status: false,
                    status: 'win'
                }
            },
            {
                $project: {
                    _id: 0,
                    amount_reward: 1,
                    time_attack: 1,
                    totalRewardUnlock: {
                        $cond: {
                            if: {
                                $gte: [currentTime, {$add: ["$time_attack", 432000000]}]
                            },
                            then: "$amount_reward",
                            else: 0
                        }
                    },
                    totalRewardLocked: {
                        $cond: {
                            if: {
                                $lt: [currentTime, {$add: ["$time_attack", 432000000]}]
                            },
                            then: "$amount_reward",
                            else: 0
                        }
                    },
                    total: {$sum: "$amount_reward"},
                    listRewardUnlock: {
                        $cond: {
                            if: {
                                $gte: [currentTime, {$add: ["$time_attack", 432000000]}]
                            },
                            then: {
                                time_attack: "$time_attack",
                                amount_reward: "$amount_reward",
                                mer_number: "$mer_number",
                                status: "$status",
                                exp_reward: "$exp_reward",
                            },
                            else: null
                        }
                    },
                    listRewardLocked: {
                        $cond: {
                            if: {
                                $lt: [currentTime, {$add: ["$time_attack", 432000000]}]
                            },
                            then: {
                                time_attack: "$time_attack",
                                amount_reward: "$amount_reward",
                                mer_number: "$mer_number",
                                status: "$status",
                                exp_reward: "$exp_reward",
                            },
                            else: null
                        }
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalRewardUnlock: {$sum: "$totalRewardUnlock"},
                    totalRewardLocked: {$sum: "$totalRewardLocked"},
                    total: {$sum: "$total"},
                    listRewardUnlock: {
                        $push: {
                            $cond: {
                                if: {$ne: ["$listRewardUnlock", null]},
                                then: "$listRewardUnlock",
                                else: "$$REMOVE"
                            }
                        }
                    },
                    listRewardLocked: {
                        $push: {
                            $cond: {
                                if: {$ne: ["$listRewardLocked", null]},
                                then: "$listRewardLocked",
                                else: "$$REMOVE"
                            }
                        }
                    }
                }
            },
        ]) as any
        if (rewardInfo.length) return rewardInfo[0];
        return {
            totalRewardUnlock: 0,
            totalRewardLocked: 0,
            total: 0,
            listRewardUnlock: [],
            listRewardLocked: []
        };
    }

    async updateTeamAttack(address: string, mercSelected: any, dataThatWasSigned: string, signature: string) {
        const recoverAddress = await this.recoverPersonalAddress(dataThatWasSigned, signature)
        if (recoverAddress.toLowerCase() !== address.toLowerCase()) {
            throw new Error("signature data does not match address.");
        }
        const checkMerIsDetached = await IMercenaries.find({
            number: {$in: mercSelected},
            isDetached: false,
        }).sort({number: -1});
        if (checkMerIsDetached.length !== mercSelected.length) {
            throw new Error("Some selected mercs do not exist");
        }
        const allMercToAddress = await this.getMerToHex(address)
        const totalTokenFind = [];
        for (let i = 0; i < mercSelected.length; i++) {
            const filter = allMercToAddress.filter(
                (e) => Number(e) === Number(mercSelected[i])
            );
            if (filter.length > 0) {
                totalTokenFind.push(filter[0]);
            }
        }
        if (totalTokenFind.length !== mercSelected.length) {
            throw new Error("Selected mercs not owned by the address");
        }

        return await this.updateTeam(
            address,
            mercSelected,
        );
    }

    async updateTeam(address: string, mercSelected: any,) {
        try {
            const res = await IPirate.findOne({address: address});
            console.log("res", res)
            if (Number(res?.numberOfUpdates) < 0 || !res) {
                throw new Error("You have exceeded the number of updates")
            }
            const updateNumber = res?.numberOfUpdates - 1;
            await IPirate.updateOne(
                {address: address},
                {numberOfUpdates: updateNumber}
            );
            return await IPirate.updateOne(
                {address: address},
                {mercSelected: mercSelected}
            );
        } catch (err: any) {
            throw new Error(err.message);
        }
    }

    async use0Coin(address: string, dataThatWasSigned: string, signature: string) {
        const recoverAddress = await this.recoverPersonalAddress(dataThatWasSigned, signature)
        if (recoverAddress !== address) {
            throw new Error("signature data does not match address.");
        }
        const queueService = QueueService.getInstance('addToQueue0Coin');
        return await queueService.addJob({address, dataThatWasSigned, signature});
    }

    async useBCoin(address: string, dataThatWasSigned: string, signature: string) {
        const recoverAddress = await this.recoverPersonalAddress(dataThatWasSigned, signature)
        if (recoverAddress !== address) {
            throw new Error("signature data does not match address.");
        }
        const queueService = QueueService.getInstance('addToQueueBCoin');
        return await queueService.addJob({address, dataThatWasSigned, signature});
    }

    async buyLuckyCoin(address: string, hash: string) {
        const queueService = QueueService.getInstance('addToQueueBuyLuckyCoin');
        return await queueService.addJob({address, hash});
    }

    async buyOriCoin(address: string, hash: string) {
        const queueService = QueueService.getInstance('addToQueueBuyOri');
        return await queueService.addJob({address, hash});
    }


}

export default PirateService;