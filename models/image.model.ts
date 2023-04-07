import mongoose, { Schema, Document } from "mongoose";

export interface IImage extends Document {
    imageUrl: string;
    width: number;
    height: number;
    data: Buffer;
}

const ImageSchema: Schema = new Schema({
    imageUrl: { type: String, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    data: { type: Buffer, required: true },
});

export default mongoose.model<IImage>("Image", ImageSchema);
