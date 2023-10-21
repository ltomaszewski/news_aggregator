import { TweetDTO } from "../dtos/TweetDTO";
import { Tweet } from "../entities/Tweet";
import { TweetRepository } from "../repositories/TweetRepository";

export class TweetService {
    private tweetRepository: TweetRepository;
    private queue: TweetDTO[] = []
    private isProcessing: boolean = false

    constructor(repository: TweetRepository) {
        this.tweetRepository = repository;
        setInterval(async () => {
            if (this.isProcessing || this.queue.length == 0) {
                return;
            }
            this.isProcessing = true
            while (this.queue.length > 0) {
                const item = this.queue.shift()
                if (item) {
                    await this.save(item)
                }
            }
            this.isProcessing = false
        }, 500);
    }

    async save(tweetDTO: TweetDTO): Promise<Tweet> {
        const tweetClone = await this.tweetRepository.findTweetWithUserIdAndText(tweetDTO.userId, tweetDTO.text)
        if (tweetClone) {
            throw Error(`"Tweet with this link already exists"`);
        }
        const allTweets = await this.tweetRepository.getAll()
        const newId = Tweet.createNewId(allTweets);
        const newTweet = Tweet.createFromDTO(tweetDTO, newId);
        await this.tweetRepository.insert(newTweet);
        return newTweet;
    }

    enqueueAndSave(tweetDTO: TweetDTO) {
        this.queue.push(tweetDTO);
    }

    async remove(id: number): Promise<Tweet> {
        const allTweets = await this.tweetRepository.getAll();
        const tweet = allTweets.find(x => x.id === id);
        if (tweet) {
            await this.tweetRepository.delete(tweet);
            return tweet;
        } else {
            throw Error(`"Tweet with this ID does not exist"`);
        }
    }

    async getAll(): Promise<Tweet[]> {
        return await this.tweetRepository.getAll();
    }
}
