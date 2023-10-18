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

        // List all tweets in the database
        app.get(basePath + "/tweet/all", async (req, res) => {
            const allTweets = await this.tweetService.getAll();
            res.json(allTweets);
        });
    }
}