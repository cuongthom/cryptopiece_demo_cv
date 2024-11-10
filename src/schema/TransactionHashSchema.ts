import {Schema, model} from "mongoose";

export interface ITransactionHash {
    transactionHash: string;
    blockHash: string;
    blockNumber: number;
    value: number;
    from: string;
    to: string;
    gasUsed: number;
    type: string;
}

interface ITransactionHashSchema extends ITransactionHash, Document {
}

const transactionHashSchema = new Schema<ITransactionHashSchema>({
    transactionHash: {type: String, required: true},
    blockHash: {type: String, required: true},
    blockNumber: {type: Number, required: true},
    value: {type: Number, required: true, default: 0},
    from: {type: String, required: true},
    to: {type: String, required: true},
    gasUsed: {type: Number, required: true, default: 0},
    type: {type: String, required: true},
}, {
    timestamps: {updatedAt: true},
});

transactionHashSchema.index({transactionHash: 1});

const ITransactionHash = model<ITransactionHashSchema>('ITransactionHash', transactionHashSchema);
export default ITransactionHash;
