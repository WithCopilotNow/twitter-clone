import "server-only";
import mongoose from "mongoose";
import z from "zod/v4";

export type MediaType = {
    _id?: mongoose.Types.ObjectId,
    source: string,
    size: number,
    mimeType: string,
    mediaName: string,
    lastModified?: Date,
    dataUrl?: string
}

export const mediaSchema = new mongoose.Schema<MediaType>({
    source: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    size: {
        type: mongoose.Schema.Types.Number,
        required: true
    },
    mimeType: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    mediaName: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    lastModified: {
        type: mongoose.Schema.Types.Date,
        required: true,
        default: new Date
    }
}, {id: false});

mediaSchema.virtual("dataUrl").get(function(){
    return `data:${this.mimeType};base64,${this.source}`;
})


export const dbMediaSchema = z.object({
    _id: z.instanceof(mongoose.Types.ObjectId),
    source: z.base64(),
    size: z.number().positive().max(1024 * 1024 * 3),
    mimeType: z.enum(['image/png', 'image/jpeg']),
    mediaName: z.string().nonempty(),
    lastModified: z.coerce.date(),
    dataUrl: z.string().refine((value) => /^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+)?(;base64)?,[a-zA-Z0-9+/=]+$/.test(value), { message: "Invalid Data URL format" }),
}).optional()