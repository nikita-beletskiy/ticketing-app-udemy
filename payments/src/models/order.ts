import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

import { OrderStatus } from '@bniki-tickets/common';

interface OrderAttrs {
  id: string;
  version: number;
  userId: string;
  price: number;
  status: OrderStatus;
}

interface OrderDoc extends mongoose.Document {
  version: number;
  userId: string;
  price: number;
  status: OrderStatus;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
  findCurrent(event: { id: string; version: number }): Promise<OrderDoc | null>;
}

const orderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    price: { type: Number, required: true },
    status: { type: String, required: true }
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

orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.findCurrent = (event: { id: string; version: number }) =>
  Order.findOne({ _id: event.id, version: event.version - 1 });

orderSchema.statics.build = (atts: OrderAttrs) =>
  new Order({
    _id: atts.id,
    version: atts.version,
    price: atts.price,
    userId: atts.userId,
    status: atts.status
  });

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order };
