import { createClient } from 'redis';

export const redisClient = createClient({
    url: 'redis://default:IZcvczMdFhGQNfE90tbW9i103OfovE8n@redis-17140.c15.us-east-1-2.ec2.redns.redis-cloud.com:17140'
});

redisClient.on('error', err => console.log('Redis Client Error', err));

