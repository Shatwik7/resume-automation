import { connect , Redis} from "https://deno.land/x/redis@v0.29.4/mod.ts";

class RedisQueue {
  private redis!:Redis;
  private queueName: string;
  constructor(queueName: string) {
    this.queueName = queueName;
  }
  async connect() {
    this.redis = await connect({ hostname: Deno.env.get("REDIS_URI")||"localhost", port: 6379 });
  }

  async enqueue(task: object): Promise<void> {
    const taskStr = JSON.stringify(task);
    await this.redis.rpush(this.queueName, taskStr);
  }

  close(): void {
    this.redis.close();
  }
}

const Queue=new RedisQueue("worker-queue");
Queue.connect();
export default Queue;