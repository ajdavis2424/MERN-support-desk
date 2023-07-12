const asyncHandler = require('express-async-handler');

const User = require('../models/userModel');
const Ticket = require('../models/ticketModel');

//@desc Get user tickets
//@route GET /api/tickets
//@access (do we need to authenticate /send token?) PRIVATE
const getTickets = asyncHandler(async (req, res) => {
  //get user using the id and the jwt
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(401);
    throw new Error('User not found');
  }

  const tickets = await Ticket.find({
    user: req.user.id,
  });
  res.status(200).json(tickets);
});

//@desc Get user ticket by id
//@route GET /api/tickets/:id
//@access (do we need to authenticate /send token?) PRIVATE
const getTicket = asyncHandler(async (req, res) => {
  //get user using the id and the jwt
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(401);
    throw new Error('User not found');
  }

  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) {
    res.status(404);
    throw new Error('Ticket not found');
  }

  //Limit to just THE user
  if (ticket.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Not authorized');
  }

  res.status(200).json(ticket);
});

//@desc create new ticket
//@route POST /api/tickets
//@access (do we need to authenticate /send token?) PRIVATE
const createTicket = asyncHandler(async (req, res) => {
  const { product, description } = req.body;

  if (!product || !description) {
    res.status(400);
    throw new Error('Please add a product and description');
  }
  //get user using the id and the jwt
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(401);
    throw new Error('User not found');
  }

  const ticket = await Ticket.create({
    product,
    description,
    user: req.user.id,
    status: 'new',
  });
  res.status(201).json(ticket);
});

//@desc DELTE user ticket by id
//@route DELETE /api/tickets/:id
//@access (do we need to authenticate /send token?) PRIVATE
const deleteTicket = asyncHandler(async (req, res) => {
  //get user using the id and the jwt
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(401);
    throw new Error('User not found');
  }

  const ticket = await Ticket.findByIdAndDelete(req.params.id);

  if (!ticket) {
    res.status(404);
    throw new Error('Ticket not found');
  }

  //Limit to just THE user
  if (ticket.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Not Authorized');
  }

  // Could not get this to work with Mongoose 7.3.0
  //await ticket.remove();
  await Ticket.deleteOne({ id: req.params.id });

  res.status(200).json({ success: true });
});

//@desc UPDATE user ticket by id
//@route PUT /api/tickets/:id
//@access (do we need to authenticate /send token?) PRIVATE
const updateTicket = asyncHandler(async (req, res) => {
  //get user using the id and the jwt
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(401);
    throw new Error('User not found');
  }

  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) {
    res.status(404);
    throw new Error('Ticket not found');
  }

  //Limit to just THE user
  if (ticket.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Not authorized');
  }
  const updatedTicket = await Ticket.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.status(200).json(updatedTicket);
});

module.exports = {
  getTickets,
  getTicket,
  createTicket,
  deleteTicket,
  updateTicket,
};
