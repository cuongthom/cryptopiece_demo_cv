import mongoose, { Schema, model } from "mongoose";


export interface IConfig  {
  index: number;
  price: number;
  countSellPack4: number;
  countSellPack8: number;
  countSellPack12: number;
}

interface IConfigSchema extends IConfig, Document {}

const configSchema = new Schema<IConfigSchema>({
  index: { type: Number, required: true },
  price: { type: Number, required: true },
  countSellPack4: { type: Number, required: true },
  countSellPack8: { type: Number, required: true },
  countSellPack12: { type: Number, required: true },
});

configSchema.index({ index: 1 });

const IConfig = model<IConfigSchema>('IConfig', configSchema);
export default IConfig;