import { Request, Response } from "express";
import sharp from "sharp";
import fetch from "node-fetch";
import Image, { IImage } from "../models/image.model";

async function getImages(req: Request, res: Response) {
    try {
        const images = await Image.find().select("-data -__v");

        res.status(200).json({
            error: 0,
            data: images
        });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({
            error: 1,
            message: "Une erreur s'est produite lors de la récupération des images"
        });
    }
}

async function getImageById(req: Request, res: Response) {
    try {
        const id = req.params.id;
        const image = await Image.findById(id);

        if (!image) {
            res.status(404).json({
                error: 1,
                message: "Image non trouvée"
            });
        }

        res.writeHead(200, { "Content-Type": "image/png" });
        res.end(image.data, "binary");
    }
    catch (e) {
        console.error(e);
        res.status(500).json({
            error: 1,
            message: "Une erreur s'est produite lors de la récupération des images"
        });
    }
}

async function downloadAndResizeImages(req: Request, res: Response) {
    try {
        const images: IImage[] = req.body.images;

        const resizedImages = await Promise.all(
            images.map(async (image: IImage) => {
                const response = await fetch(image.imageUrl);
                const buffer = await response.buffer();

                let resizedBuffer;
                if (image.width && image.height) {
                    resizedBuffer = await sharp(buffer)
                        .resize(image.width, image.height)
                        .png()
                        .toBuffer();
                }
                else {
                    resizedBuffer = await sharp(buffer)
                        .png()
                        .toBuffer();
                }

                const resizedImage = new Image({
                    imageUrl: image.imageUrl,
                    width: image.width,
                    height: image.height,
                    data: resizedBuffer
                });

                const savedImage = await resizedImage.save();

                return {
                    _id: savedImage._id,
                    imageUrl: savedImage.imageUrl,
                    width: savedImage.width,
                    height: savedImage.height
                };
            })
        );

        res.status(200).json({
            error: 0,
            data: resizedImages
        });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({
            error: 1,
            message: "Une erreur s'est produite lors du téléchargement / resizing des images"
        });
    }
}

export default {
    getImages,
    getImageById,
    downloadAndResizeImages
}