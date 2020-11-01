import server from './app';
import consumerService from './rabbitmq/receiver';

server.start();
consumerService.receive().then(()=>{
    console.log('Worker is running');
});
