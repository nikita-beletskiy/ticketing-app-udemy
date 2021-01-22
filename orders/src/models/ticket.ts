import mongoose from 'mongoose';
import { Order, OrderStatus } from './order';

interface TicketAttrs {
  title: string;
  price: number;
}

export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    }
  },
  {
    toJSON: {
      transform(doc, ret) {
        (ret.id = ret._id), delete ret._id;
      }
    }
  }
);

ticketSchema.statics.build = (attrs: TicketAttrs) => new Ticket(attrs);

// Run query to find an order where the ticket is the ticket we found previously *and* the order's status is *not* Cancelled. If we find an order from that means the ticket *is* reserved
ticketSchema.methods.isReserved = async function () {
  // this === Ticket Document that we call 'isReserved' on
  // '!!' converts actual order that is found to 'true' or null to 'false'
  return !!(await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
        OrderStatus.Created
      ]
    }
  }));
};

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };
