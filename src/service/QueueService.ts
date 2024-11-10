import Queue from "bull";

class QueueService {
    public static instance: QueueService;
    private queue;

    constructor(queueName: string) {
        this.queue = new Queue(queueName, {
            redis: {
                host: Bun.env.REDIS_HOST as string,
                port: Bun.env.REDIS_PORT as any,
                username: Bun.env.REDIS_USERNAME,
                password: Bun.env.REDIS_PASSWORD,
            }
        });

        if (queueName === 'detached') {
            this.queue.process(this.detachedProcess);
        }

        if (queueName === 'addToQueueStartUp') {
            this.queue.process(this.startUpProcess);
        }

        if (queueName === 'addToQueueLevelUp') {
            this.queue.process(this.levelUpProcess);
        }

        if (queueName === 'addToQueueAttack') {
            this.queue.process(this.attackProcess);
        }

        if (queueName === 'addToQueueSpeedAttack') {
            this.queue.process(this.speedAttackProcess);
        }

        if (queueName === 'addToQueue0Coin') {
            this.queue.process(this.addToQueue0CoinProcess);
        }

        if (queueName === 'addToQueueBCoin') {
            this.queue.process(this.addToQueueBCoinProcess);
        }

        if (queueName === 'addToQueueBuyLuckyCoin') {
            this.queue.process(this.addToQueueBuyLuckyCoinProcess);
        }

        if (queueName === 'addToQueueBuyOri') {
            this.queue.process(this.addToQueueBuyOriProcess);
        }
    }

    public static getInstance(queueName: string): QueueService {
        if (!QueueService.instance) {
            QueueService.instance = new QueueService(queueName);
        }
        return QueueService.instance;
    }

    public async addJob(jobData: any) {

        return new Promise(async (resolve, reject) => {
            try {
                const job = await this.queue.add(jobData);
                job.queue.on('completed', (job: any, result) => {
                    console.log("result", result)
                    resolve(result);
                });
            } catch (e) {
                console.log("reject", e);
                reject(e);
            }
        });
    }

    private detachedProcess(job: any, done: any) {
        done(null, {value: job.data});
    }

    private startUpProcess(job: any, done: any) {
        done(null, {value: job});
    }

    private levelUpProcess(job: any, done: any) {
        done(null, {value: job});
    }

    private attackProcess(job: any, done: any) {
        done(null, {value: job});
    }

    private speedAttackProcess(job: any, done: any) {
        done(null, {value: job});
    }

    private addToQueue0CoinProcess(job: any, done: any) {
        done(null, {value: job});
    }

    private addToQueueBCoinProcess(job: any, done: any) {
        done(null, {value: job});
    }

    private addToQueueBuyLuckyCoinProcess(job: any, done: any) {
        done(null, {value: job});
    }

    private addToQueueBuyOriProcess(job: any, done: any) {
        done(null, {value: job});
    }
}

export default QueueService;