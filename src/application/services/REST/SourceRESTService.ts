import express from "express";
import { SourceService } from "../SourceService";
import { SourceDTO } from "../../dtos/SourceDTO";
import { RssService } from "../rssService/RssService";

export class SourceRESTService {
    private sourceService: SourceService
    private rssService: RssService

    constructor(sourceService: SourceService, rssService: RssService) {
        this.sourceService = sourceService;
        this.rssService = rssService
    }

    installEndpoints(basePath: string, app: express.Application) {
        // Add a source to the database
        app.post(basePath + "/source/add", async (req, res) => {
            try {
                const sourceDTO = SourceDTO.createFromObject(req.body);
                const result = await this.sourceService.save(sourceDTO);
                this.rssService.add(result)
                res.status(201).json(result);
            } catch (error: any) {
                res.status(400).json({ error: error.message });
            }
        });

        // Remove a source from the database
        app.delete(basePath + "/source/remove/:id", async (req, res) => {
            const id = parseInt(req.params.id, 10);
            if (!id) {
                return res.status(400).json({ message: "Missing required fields." });
            }

            try {
                const removedSource = await this.sourceService.remove(id)
                this.rssService.remove(removedSource)
                res.sendStatus(204);
            } catch (error: any) {
                res.status(400).json({ error: error.message });
            }
        });

        // List all sources in the database
        app.get(basePath + "/source/all", async (req, res) => {
            const allSources = await this.sourceService.getAll();
            res.json(allSources);
        });
    }
}