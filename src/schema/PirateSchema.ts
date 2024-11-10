import {Schema, model, Document} from "mongoose";
import IMarket from "./MarketSchema";

export interface IPirate {
    address: string;
    mercSelected: number[];
    ori: number;
    totalRewardNotWithdraw: number;
    withdrawTime: number;
    totalReward: number;
    withdrawing: boolean;
    numberOfUpdates: number;
    ticket: number;
    oCoin: number;
    bCoin: number;
    diamondBox: number;
    bodyPieceShip: number;
    headPieceShip: number;
    leftPieceShip: number;
    rightPieceShip: number;
    leftFootPieceShip: number;
    rightFootPieceShip: number;
    updatedAt?: Date;
}

interface IPirateSchema extends IPirate, Document {
}

const pirateSchema = new Schema<IPirateSchema>({
    address: {type: String, required: true},
    mercSelected: {type: [Number], default: []},
    ori: {type: Number, required: true, default: 0},
    totalRewardNotWithdraw: {type: Number, required: true, default: 0},
    withdrawTime: {type: Number, required: true, default: 0},
    totalReward: {type: Number, required: true, default: 0},
    withdrawing: {type: Boolean, required: true, default: false},
    numberOfUpdates: {type: Number, required: true, default: 4},
    ticket: {type: Number, required: true, default: 0},
    oCoin: {type: Number, required: true, default: 0},
    bCoin: {type: Number, required: true, default: 0},
    diamondBox: {type: Number, required: true, default: 0},
    bodyPieceShip: {type: Number, required: true, default: 0},
    headPieceShip: {type: Number, required: true, default: 0},
    leftPieceShip: {type: Number, required: true, default: 0},
    rightPieceShip: {type: Number, required: true, default: 0},
    leftFootPieceShip: {type: Number, required: true, default: 0},
    rightFootPieceShip: {type: Number, required: true, default: 0},
}, {
    timestamps: {createdAt: false, updatedAt: true},
});

pirateSchema.index({address: 1});

const IPirate = model<IPirateSchema>('IPirate', pirateSchema)
export default IPirate

