import mongoose from 'mongoose';

// describes the properties that are required to create a new ticket
interface TicketAttrs {
  title: string;
  price: number;
  userId: string;
}

// describes the properties of a Ticket Document
interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
}

// describes the properties of a Ticket Model
interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}

const ticketSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    userId: { type: String, required: true }
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      }
    }
  }
);

ticketSchema.statics.build = (attrs: TicketAttrs) => new Ticket(attrs);

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };
