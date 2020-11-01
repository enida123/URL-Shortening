import amqp from 'amqplib';

class Sender {
    async sendMessage(message) {
        try {
            const data = JSON.stringify(message);
            const queue = "shortener-queue";
    
            const conn = await amqp.connect('amqp://localhost:5672');
            const ch = await conn.createChannel();
            
            await ch.assertQueue(queue,{ durable: false});
    
            await ch.sendToQueue(queue, Buffer.from(data));
            
        } catch (error) {
            throw error;
        }
    }
}

export default new Sender();