import { Stan, Message } from 'node-nats-streaming';
import { Subjects } from './subjects';

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Listener<T extends Event> {
  abstract subject: T['subject']; // Name of the channel to listen to
  abstract queueGroupName: string; // Name of the queue group to join to
  abstract onMessage(data: T['data'], msg: Message): void; // Function to run when a message is received
  private client: Stan; // Pre-initialized NATS client
  protected ackWait = 5 * 1000; // Number of seconds this listener has to ack a message

  constructor(client: Stan) {
    this.client = client;
  }

  // Default subscription options
  subscriptionOptions() {
    return this.client
      .subscriptionOptions()
      .setDeliverAllAvailable()
      .setManualAckMode(true)
      .setAckWait(this.ackWait)
      .setDurableName(this.queueGroupName);
  }

  // Code to set up the subscription
  listen() {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions()
    );

    subscription.on('message', (msg: Message) => {
      console.log(
        `Message received: ${this.subject} => ${this.queueGroupName}`
      );

      const rawData = msg.getData();
      const parsedData =
        typeof rawData === 'string'
          ? JSON.parse(rawData)
          : JSON.parse(rawData.toString('utf8'));

      this.onMessage(parsedData, msg);
    });
  }
}
