import {Schema, model} from "mongoose";

export interface ITransactionAttack {
    mer_number: number;
    status: string;
    time_attack: number;
    amount_reward: number;
    exp_reward: number;
    address: string;
    withdraw_status: boolean;
}

interface ITransactionAttackSchema extends ITransactionAttack, Document {
}

const transactionSchema = new Schema<ITransactionAttackSchema>({
    mer_number: {type: Number, required: true},
    status: {type: String, required: true},
    time_attack: {type: Number, required: true},
    amount_reward: {type: Number, required: true},
    exp_reward: {type: Number, required: true},
    address: {type: String, required: true},
    withdraw_status: {type: Boolean, required: true},
});

transactionSchema.index({address: 1});

const ITransactionAttack = model<ITransactionAttackSchema>('ITransactionAttack', transactionSchema);
export default ITransactionAttack;
