import {Request, Response} from "express";
import {dbCommon, dbCurrent} from "../models";
import fs from "fs";
import axios from "axios";

export const loadData = async (req: Request, res: Response) => {
    try {
        let response;
        let separator = ";;;";
        if (req.body.separator && req.body.url) {
            separator = req.body.separator;
            const url = req.body.url;
            response = await axios.get(url);
            response = response.data;
        }
        else {
            response = fs.readFileSync(`${__dirname}/../../data/artistes.csv`, "utf8");
        }
        response = response.split("\n");
        response = response.map((line: string) => {
            return line.split(separator);
        });
        const nameIdx = response[0].indexOf("Nom de l'artiste");
        const countryIdx = response[0].indexOf("Pays d'origine");
        const websiteIdx = response[0].indexOf("Lien du site web");
        const youtubeIdx = response[0].indexOf("Lien de vidéo YouTube");
        const bioIdx = response[0].indexOf("Biographie");
        const photoIdx = response[0].indexOf("Lien de photo");

        response = response.map((line: string[]) => {
            return {
                nom: line[nameIdx],
                pays: line[countryIdx].split(","),
                lien_site: line[websiteIdx],
                lien_video: line[youtubeIdx],
                biographie: line[bioIdx],
                photo: line[photoIdx]
            };
        });
        response.shift();

        for (let i = 0; i < response.length; i++) {
            const line = response[i];
            for (let j = 0; j < line.pays.length; j++) {
                line.pays[j] = await getIdPaysByName(line.pays[j].trim());
            }
            const artiste = await dbCurrent.artistes.create(line);
            await artiste.setPays(line.pays);
        }

        res.status(200).json({
            error: 0,
            data: response
        });
    }
    catch (e) {
        console.log(e);
        res.status(500).json({
            error: 1,
            message: "Une erreur est survenue lors de la récupération des données."
        });
    }
}

const getIdPaysByName = async (name: string) => {
    const rep = await dbCommon.pays.findOne({
        where: {
            libelle: name
        }
    });
    if (rep) {
        return rep.id;
    }
    return new Error("Pays non trouvé");
}