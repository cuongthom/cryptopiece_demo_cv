import {Schema, model, Document} from "mongoose";


export interface IMercenaries {
    pirate: string;
    number: number;
    element: string;
    rarity: string;
    rarityNumber: number;
    level: number;
    exp: number;
    fruit_eat: string;
    stamina: number;
    recovery_speed_stamina: number;
    max_battle_over_one_day: number;
    avatar: string;
    type: string;
    battled_in_day: number;
    name: string;
    expUpLevel: number;
    isDetached: boolean;
    transferFee: boolean;
}

interface IMercenariesSchema extends IMercenaries, Document {
}

const mercenariesSchema = new Schema<IMercenariesSchema>({
    pirate: {type: String},
    number: {type: Number, required: true},
    element: {type: String, required: true},
    rarity: {type: String, required: true},
    rarityNumber: {type: Number, required: true},
    level: {type: Number, required: true},
    exp: {type: Number, required: true},
    fruit_eat: {type: String},
    stamina: {type: Number, required: true},
    recovery_speed_stamina: {type: Number, required: true},
    max_battle_over_one_day: {type: Number, required: true},
    avatar: {type: String, required: true},
    type: {type: String, required: true},
    battled_in_day: {type: Number, required: true},
    name: {type: String, required: true},
    expUpLevel: {type: Number, required: true},
    isDetached: {type: Boolean, required: true},
    transferFee: {type: Boolean, required: true},
});

mercenariesSchema.index({pirate: 1});


const IMercenaries = model<IMercenariesSchema>('IMercenaries', mercenariesSchema)
export default IMercenaries