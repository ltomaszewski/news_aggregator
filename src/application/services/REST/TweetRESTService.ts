import express from "express";
import { TweetService } from "../TweetService";
import { TweetDTO } from "../../dtos/TweetDTO";

export class TweetRESTService {
    private tweetService: TweetService;

    constructor(tweetService: TweetService) {
        this.tweetService = tweetService;
    }

    installEndpoints(basePath: string, app: express.Application) {
        // Add a tweet to the database
        app.post(basePath + "/tweet/add", async (req, res) => {
            try {
                const tweetDTO = TweetDTO.createFromObject(req.body);
                const result = await this.tweetService.save(tweetDTO);
                res.status(201).json(result);
            } catch (error: any) {
                res.status(400).json({ error: error.message });
            }
        });

        // Remove a tweet from the database
        app.delete(basePath + "/tweet/remove/:id", async (req, res) => {
            const id = parseInt(req.params.id, 10);
            if (!id) {
                return res.status(400).json({ message: "Missing required fields." });
            }

            try {
                const removedTweet = await this.tweetService.remove(id);
                res.sendStatus(204);
            } catch (error: any) {
                res.status(400).json({ error: error.message });
            }
        });

        // List all tweets in the database
        app.get(basePath + "/tweet/all", async (req, res) => {
            const allTweets = await this.tweetService.getAll();
            res.json(allTweets);
        });
    }
}