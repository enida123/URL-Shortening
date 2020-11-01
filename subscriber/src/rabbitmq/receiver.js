import amqp from 'amqplib';
import cacheService from '../cache/cache';

class Receiver {
    async receive() {
        try {

            const conn = await amqp.connect('amqp://localhost:5672');
            const channel = await conn.createChannel();
            let queue = 'shortener-queue';

            await channel.assertQueue(queue, { durable: false });
            channel.prefetch(1);

            channel.consume(queue, (msg) => {
                console.log('Fetching');
                let obj = JSON.parse(msg.content.toString());

                let res = this.cacheMessage(obj).then(() => {
                    console.log('Redis -> Updating storage data..');
                });

                return obj;
            }, {
                noAck: true
            });

            // amqp.connect('amqp://localhost:5672', (error, connection) => {
            //     let obj = {};
            //     let queue = 'shortener-queue';

            //     if (error) {
            //         logger.error(error);
            //         throw error;
            //     }

            //     connection.createChannel((error1, channel) => {
            //         if (error1) {
            //             logger.error(error1);
            //             throw error1;
            //         }

            //         channel.assertQueue(queue, {
            //             durable: false
            //         });
            //         channel.prefetch(1);

            //         console.log('[*] Waiting for messages in %s. To exit press CTRL+C', queue);


            //         await channel.consume()
            //         channel.consume(queue, (msg) => {
            //             console.log('Fetching');
            //             obj = JSON.parse(msg.content.toString());

            //             let res = this.cacheMessage(obj).then(() => {
            //                 console.log('Redis -> Updating storage data..');
            //             });

            //             return obj;
            //         }, {
            //             noAck: true
            //         });

            //     });
            // });
        } catch (error) {
            throw error;
        }
    }

    async cacheMessage(message) {
        try {
            if (message.isDeleted === 1) {
                await cacheService.removeMessage(message.hash);
                console.log('Removed from cache');
            } else {
                await cacheService.saveMessage(message);
                console.log('Cached message');
            }
        } catch (error) {
            throw error;
        }
    }
}

export default new Receiver();