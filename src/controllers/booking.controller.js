import mongoose from "mongoose";
import { Room } from "../models/rooms.model.js";
import { Booking } from "../models/bookings.model.js";

const createBooking = async (req, res) => {
    try {
        const roomId = req.params.roomId;

        const { guestName, guestEmail, checkIn, checkOut } = req.body;

        if (!mongoose.isValidObjectId(roomId)) {
            return res.status(400).json({
                message: "Invalid room ID",
            });
        }

        const room = await Room.findById(roomId);

        if (!room) {
            return res.status(404).json({
                message: "Room not found",
            });
        }

        const newCheckIn = new Date(checkIn);
        const newCheckOut = new Date(checkOut);

        if (isNaN(newCheckIn.getTime()) || isNaN(newCheckOut.getTime())) {
            return res.status(400).json({
                message: "Invalid date",
            });
        }

        if (newCheckIn >= newCheckOut) {
            return res.status(400).json({
                message: "Invalid date range",
            });
        }

        const conflictBooking = await Booking.findOne({
            room: roomId,
            status: "confirmed",
            checkIn: { $lt: newCheckOut },
            checkOut: { $gt: newCheckIn },
        });

        if (conflictBooking) {
            return res.status(409).json({
                message: "Room is already booked for these dates",
            });
        }

        const booking = await Booking.create({
            room: roomId,
            guestName,
            guestEmail,
            checkIn: newCheckIn,
            checkOut: newCheckOut,
        });

        return res.status(201).json({
            message: "Booking successful",
            booking,
        });
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: "Invalid booking data",
                error: error.message,
            });
        }

        return res.status(500).json({
            message: "Failed to book",
            error: error.message,
        });
    }
};

const getBookings = async (req, res) => {
    try {
        const bookings = await Booking.find();

        return res.status(200).json({
            bookings,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to fetch bookings",
            error: error.message,
        });
    }
};

const getBookingById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: "Invalid booking ID",
            });
        }

        const booking = await Booking.findById(id);

        if (!booking) {
            return res.status(404).json({
                message: "Booking not found",
            });
        }

        return res.status(200).json({
            booking,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to fetch booking",
            error: error.message,
        });
    }
};

const updateBooking = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: "Invalid booking ID",
            });
        }

        const booking = await Booking.findById(id);

        if (!booking) {
            return res.status(404).json({
                message: "Booking not found",
            });
        }

        const allowedFields = [
            "guestName",
            "guestEmail",
            "checkIn",
            "checkOut",
        ];

        const updates = {};

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                message: "No valid fields provided for update",
            });
        }

        const newCheckIn = new Date(updates.checkIn ?? booking.checkIn);

        const newCheckOut = new Date(updates.checkOut ?? booking.checkOut);

        if (isNaN(newCheckIn.getTime()) || isNaN(newCheckOut.getTime())) {
            return res.status(400).json({
                message: "Invalid date",
            });
        }

        if (newCheckIn >= newCheckOut) {
            return res.status(400).json({
                message: "Invalid date range",
            });
        }

        if (updates.checkIn !== undefined || updates.checkOut !== undefined) {
            const conflictBooking = await Booking.findOne({
                _id: { $ne: id },
                room: booking.room,
                status: "confirmed",
                checkIn: { $lt: newCheckOut },
                checkOut: { $gt: newCheckIn },
            });

            if (conflictBooking) {
                return res.status(409).json({
                    message: "Room is already booked for these dates",
                });
            }
        }

        updates.checkIn = newCheckIn;
        updates.checkOut = newCheckOut;

        const updatedBooking = await Booking.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true,
        });

        return res.status(200).json({
            message: "Booking updated successfully",
            booking: updatedBooking,
        });
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: "Invalid booking data",
                error: error.message,
            });
        }

        return res.status(500).json({
            message: "Failed to update booking",
            error: error.message,
        });
    }
};

const cancelBooking = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: "Invalid booking ID",
            });
        }

        const booking = await Booking.findOneAndUpdate(
            {
                _id: id,
                status: "confirmed",
            },
            {
                status: "cancelled",
            },
            {
                new: true,
            },
        );

        if (!booking) {
            return res.status(404).json({
                message: "Confirmed booking not found",
            });
        }

        return res.status(200).json({
            message: "Booking cancelled successfully",
            booking,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Booking cancellation failed",
            error: error.message,
        });
    }
};

const deleteBooking = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: "Invalid booking ID",
            });
        }

        const deletedBooking = await Booking.findByIdAndDelete(id);

        if (!deletedBooking) {
            return res.status(404).json({
                message: "Booking not found",
            });
        }

        return res.status(200).json({
            message: "Booking deleted successfully",
            booking: deletedBooking,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Booking deletion failed",
            error: error.message,
        });
    }
};

export {
    createBooking,
    getBookings,
    getBookingById,
    updateBooking,
    cancelBooking,
    deleteBooking,
};
