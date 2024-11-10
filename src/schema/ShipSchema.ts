import {Schema, model, Document} from "mongoose";

export interface IShip {
    transactionHash: string;
    blockHash: string;
    blockNumber: number;
    value: number;
    from: string;
    to: string;
    gasUsed: number;
    type: string;
}

interface IShipSchema extends IShip, Document {
}

const shipSchema = new Schema<IShipSchema>(
    {
        transactionHash: {type: String, required: true},
        blockHash: {type: String, required: true},
        blockNumber: {type: Number, required: true},
        value: {type: Number, required: true},
        from: {type: String, required: true},
        to: {type: String, required: true},
        gasUsed: {type: Number, required: true},
        type: {type: String, required: true},
    },
    {
        timestamps: true,
    }
);

shipSchema.index({transactionHash: 1});

const IShip = model<IShipSchema>('IShip', shipSchema);
export default IShip;
