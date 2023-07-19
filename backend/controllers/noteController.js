const asyncHandler = require('express-async-handler');

const User = require('../models/userModel');
const Ticket = require('../models/ticketModel');
const Note = require('../models/noteModel');

//@desc Get notes for a ticket
//@route GET /api/tickets/:TicketId/noptes
//@access (do we need to authenticate /send token?) PRIVATE
const getNotes = asyncHandler(async (req, res) => {
  //get user using the id and the jwt
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(401);
    throw new Error('User not found');
  }

  const ticket = await Ticket.findById(req.params.ticketId);

  //make sure its the users ticket
  if (ticket.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  const notes = await Note.find({ ticket: req.params.ticketId });
  res.status(200).json(notes);
});

//@desc CREAT TICKET NOTE
//@route POST /api/tickets/:TicketId/noptes
//@access (do we need to authenticate /send token?) PRIVATE
const addNote = asyncHandler(async (req, res) => {
  //get user using the id and the jwt
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(401);
    throw new Error('User not found');
  }

  const ticket = await Ticket.findById(req.params.ticketId);

  //make sure its the users ticket
  if (ticket.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  const note = await Note.create({
    text: req.body.text,
    isStaff: false,
    ticket: req.params.ticketId,
    user: req.user.id,
  });

  res.status(200).json(note);
});

module.exports = {
  getNotes,
  addNote,
};
