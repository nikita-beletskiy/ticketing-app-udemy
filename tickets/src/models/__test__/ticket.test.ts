import { Ticket } from '../ticket';

const title = global.testTitle;
const price = global.testPrice;

it('implements optimistic concurrency control', async done => {
  // Create an instance of a ticket and save it to the database
  const ticket = Ticket.build({ title, price, userId: '123' });
  await ticket.save();

  // Fetch the ticket twice
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  // Make two separate changes to the tickets we fetched
  firstInstance!.set({ price: 999 });
  secondInstance!.set({ price: 888 });

  // Save the first fetched ticket
  await firstInstance!.save();

  // Save the second fetched ticket expecting an error
  try {
    await secondInstance!.save();
  } catch (err) {
    return done();
  }

  throw new Error('Should not reach this point');
});

it('increments the version number on multiple saves', async () => {
  const ticket = Ticket.build({ title, price, userId: '123' });

  await ticket.save();
  expect(ticket.version).toEqual(0);
  await ticket.save();
  expect(ticket.version).toEqual(1);
  await ticket.save();
  expect(ticket.version).toEqual(2);
});
