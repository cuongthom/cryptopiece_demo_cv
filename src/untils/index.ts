import {ethers} from "ethers";
import transactionHashSchema from "../schema/TransactionHashSchema";
import {Web3} from "web3";


const provider = new ethers.providers.JsonRpcProvider(Bun.env.URL_PROVIDER);

const contractMarket = new ethers.Contract(
    Bun.env.MARKET_ADDRESS as string,
    Bun.env.MARKET_ABI as ethers.ContractInterface,
    provider
);
const contractOwner = new ethers.Contract(
    Bun.env.MERCENARY_ADDRESS as string,
    Bun.env.ABI_MERCENARY as ethers.ContractInterface,
    provider
);

const contractAddress = process.env.URL_PROVIDER;
const abi = process.env.ABI_MERCENARY;


const randomMer = async () => {
    const imageMercArr = [
        "https://storage.googleapis.com/ldgood.appspot.com/merc-broke.gif",
        "https://storage.googleapis.com/ldgood.appspot.com/merc-cardinal.gif",
        "https://storage.googleapis.com/ldgood.appspot.com/merc-cross.gif",
        "https://storage.googleapis.com/ldgood.appspot.com/merc-helsing.gif",
        "https://storage.googleapis.com/ldgood.appspot.com/merc-loogie.gif",
        "https://storage.googleapis.com/ldgood.appspot.com/merc-monie.gif",
        "https://storage.googleapis.com/ldgood.appspot.com/merc-sharksan.gif",
        "https://storage.googleapis.com/ldgood.appspot.com/merc-slinger.gif",
    ];
    const names = [
        "Broke",
        "Cardinal",
        "Cross",
        "Helsing",
        "Loogie",
        "Monie",
        "Sharksan",
        "Slinger",
    ];
    const random = Math.floor(Math.random() * 8);
    return {image: imageMercArr[random], name: names[random]};
};

const getRarityAttributes = (random: number) => {
    console.log("ramdom", random)
    if (random < 1 || random > 100) {
        throw new Error("Invalid random number");
    }

    const rarities = [
        {range: [1, 51], rarity: "common", rarityNumber: 1, recovery_speed_stamina: 7, max_battle_over_one_day: 7},
        {range: [52, 80], rarity: "rare", rarityNumber: 2, recovery_speed_stamina: 6, max_battle_over_one_day: 8},
        {range: [81, 90], rarity: "elite", rarityNumber: 3, recovery_speed_stamina: 5, max_battle_over_one_day: 10},
        {range: [91, 95], rarity: "epic", rarityNumber: 4, recovery_speed_stamina: 4, max_battle_over_one_day: 12},
        {range: [96, 98], rarity: "legendary", rarityNumber: 5, recovery_speed_stamina: 3, max_battle_over_one_day: 16},
        {range: [99, 99], rarity: "mythic", rarityNumber: 6, recovery_speed_stamina: 2, max_battle_over_one_day: 24},
        {range: [100, 100], rarity: "godly", rarityNumber: 7, recovery_speed_stamina: 1, max_battle_over_one_day: 48},
    ];

    const rarity = rarities.find(e => random >= e.range[0] && random <= e.range[1]);
    console.log("rarity", rarity)
    if (!rarity) {
        throw new Error("Rarity Attributes not found");
    }

    return {
        rarity: rarity.rarity,
        rarityNumber: rarity.rarityNumber,
        recovery_speed_stamina: rarity.recovery_speed_stamina,
        max_battle_over_one_day: rarity.max_battle_over_one_day,
    };
};

const randElement = async () => {
    try {
        const elements = [
            {name: "fire", probability: 16},
            {name: "earth", probability: 16},
            {name: "metal", probability: 16},
            {name: "water", probability: 16},
            {name: "wood", probability: 16},
            {name: "dark", probability: 10},
            {name: "light", probability: 10},
        ];

        const random = Math.floor(Math.random() * 100) + 1;
        let cumulativeProbability = 0;

        for (const element of elements) {
            cumulativeProbability += element.probability;
            if (random <= cumulativeProbability) {
                return element.name;
            }
        }
    } catch (err: any) {
        throw new Error("Random element generation failed");
    }
};


const checkOwnerOfMerNumber = async (merNumber: number) => {
    try {
        if (!contractAddress || !abi) return;
        const web3 = new Web3(new Web3.providers.HttpProvider(contractAddress));
        const resAbi = JSON.parse(abi);
        const contract = new web3.eth.Contract(
            resAbi,
            String(process.env.MERCENARY_ADDRESS)
        );
        return await contract.methods.ownerOf(Number(merNumber)).call();
    } catch (err: any) {
        throw new Error(err.message)
    }
};


export {
    provider,
    contractOwner,
    contractMarket,
    randomMer,
    getRarityAttributes,
    randElement,
    checkOwnerOfMerNumber,
};