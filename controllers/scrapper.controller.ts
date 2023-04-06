import {Request, Result} from "express";
import {startBrowser} from "../utils/browser";
import {scraperObject} from "../utils/pageScraper";
import {dbCurrent} from "../models";

export const scrap = async (req: Request, res: Result) => {
    try {
        const browser = await startBrowser();
        const scrapedData = await scraperObject.scraper(browser);
        await dbCurrent.scenes.bulkCreate(scrapedData);
        await browser.close();
        res.status(200).json({
            error: 0,
            data: scrapedData
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