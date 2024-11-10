import {Schema, model, Document} from "mongoose";

export interface IMarket {
    sellerAddress: string;
    price: number;
    number: number;
    sold: boolean;
    cancelSale: boolean;
    updateAt: Date;
}

interface IMarketSchema extends IMarket, Document {
}

const marketSchema = new Schema<IMarketSchema>(
    {
        sellerAddress: {type: String, required: true},
        price: {type: Number, required: true},
        number: {type: Number, required: true},
        sold: {type: Boolean, required: true},
        cancelSale: {type: Boolean, required: true},
    },
    {
        timestamps: {updatedAt: true},
    }
);

marketSchema.index({sellerAddress: 1});

const IMarket = model<IMarketSchema>('IMarket', marketSchema)
export default IMarket
