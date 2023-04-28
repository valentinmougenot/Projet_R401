import express from 'express';

import etag from 'etag';
import responseCaching from './middleware/responseCaching';
import passportSetup from './config/passport-setup.config';

import actualiteRouter from "./routes/actualite.router";
import artisteRouter from './routes/artiste.router';
import authRouter from './routes/auth.router';
import concertRouter from './routes/concert.router';
import categorieRouter from "./routes/categorie.router";
import etlPipelineRouter from "./routes/etlPipeline.router";
import genreRouter from "./routes/genre.router";
import imageRouter from "./routes/image.router";
import notificationRouter from "./routes/notification.router";
import paysRouter from "./routes/pays.router";
import reseauxSociauxRouter from "./routes/reseauxSociaux.router";
import roleRouter from "./routes/role.router";
import saisonRouter from "./routes/saison.router";
import sceneRouter from "./routes/scene.router";
import scraperRouter from "./routes/scraper.router";
import serviceRouter from "./routes/service.router";
import standRouter from "./routes/stand.router";
import typeactuRouter from "./routes/typeactu.router";
import typesceneRouter from "./routes/typescene.router";
import typestandRouter from "./routes/typestand.router";
import utilisateurRouter from "./routes/utilisateur.router";
import mongoose from "mongoose";
import helmet from "helmet";

import dotenv from "dotenv";
dotenv.config();

import cors from "cors";

const app = express();
app.use(helmet());
app.disable('x-powered-by');

app.use(cors({
    origin: '*',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'x-access-token']
}));

const MONGO_URI = "mongodb://localhost:27017/images_r401";
mongoose.connect(MONGO_URI);
mongoose.connection.once("open", () => {
    console.log("Connecté à la base de données MongoDB.");
});

import bodyParser from "body-parser";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passportSetup.initialize())

import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Mon API REST Express',
            version: '1.0.0',
            description: 'Documentation Swagger pour mon API REST Express'
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Serveur local'
            }
        ]
    },
    apis: ['./routes/*.ts']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(responseCaching)

app.use('/actualite', actualiteRouter);
app.use('/artiste', artisteRouter);
app.use('/auth', authRouter);
app.use('/categorie', categorieRouter);
app.use('/concert', concertRouter);
app.use('/etl-pipeline', etlPipelineRouter);
app.use('/genre', genreRouter);
app.use('/image', imageRouter);
app.use('/notification', notificationRouter);
app.use('/pays', paysRouter);
app.use('/reseauxsociaux', reseauxSociauxRouter);
app.use('/role', roleRouter);
app.use('/saison', saisonRouter);
app.use('/scene', sceneRouter);
app.use('/scraper', scraperRouter);
app.use('/service', serviceRouter);
app.use('/stand', standRouter);
app.use('/typeactu', typeactuRouter);
app.use('/typescene', typesceneRouter);
app.use('/typestand', typestandRouter);
app.use('/utilisateur', utilisateurRouter);
app.use('/status', (req, res) => {
    res.status(200).json({
        error: 0,
        message: "Server is running"
    });
});

app.use('*', (req, res) => {
    res.status(404).json({
        error: 1,
        message: "La ressource demandée n'existe pas."
    });
});

app.listen(process.env.PORT, () => {
    console.log(`Server started at port ${process.env.PORT}`);
});