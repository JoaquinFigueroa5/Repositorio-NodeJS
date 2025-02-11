import { Schema, model } from "mongoose";

const AppoitSchema = Schema({
    title: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    hour:{
        type: String,
        default: () => new Date().toLocaleTimeString("es-ES", { hour12: false})
    },
    description: {
        type: String,
        required: true
    },
    pet: {
        type: Schema.Types.ObjectId,
        ref: 'pet',
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    status: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    versionKey: false
});


export default model('Appoit', AppoitSchema);