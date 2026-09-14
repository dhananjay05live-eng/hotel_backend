import mongoose from "mongoose";
import { Room } from "../models/rooms.model.js";
import { Hotel } from "../models/hotels.model.js";

const createRoom = async (req, res) => {
    try {
        const { hotel, roomNumber, type, pricePerNight, capacity } = req.body;

        if (!mongoose.Types.ObjectId.isValid(hotel)) {
            return res.status(400).json({
                message: "Invalid hotel ID",
            });
        }

        const existingHotel = await Hotel.findById(hotel);

        if (!existingHotel) {
            return res.status(404).json({
                message: "Hotel not found",
            });
        }

        const room = await Room.create({
            hotel,
            roomNumber,
            type,
            pricePerNight,
            capacity,
        });

        res.status(201).json({
            message: "Room created successfully",
            room,
        });
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: "Invalid room data",
                error: error.message,
            });
        }

        res.status(500).json({
            message: "Failed to create room",
            error: error.message,
        });
    }
};

const getRooms = async (req, res) => {
    try {
        const rooms = await Room.find();

        res.status(200).json({
            rooms,
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch rooms",
            error: error.message,
        });
    }
};

const getRoomById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid room ID",
            });
        }

        const room = await Room.findById(id);

        if (!room) {
            return res.status(404).json({
                message: "Room not found",
            });
        }

        res.status(200).json({
            room,
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch room",
            error: error.message,
        });
    }
};

const updateRoom = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid room ID",
            });
        }

        const allowedFields = [
            "hotel",
            "roomNumber",
            "type",
            "pricePerNight",
            "capacity",
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

        if (updates.hotel !== undefined) {
            if (!mongoose.Types.ObjectId.isValid(updates.hotel)) {
                return res.status(400).json({
                    message: "Invalid hotel ID",
                });
            }

            const hotel = await Hotel.findById(updates.hotel);

            if (!hotel) {
                return res.status(404).json({
                    message: "Hotel not found",
                });
            }
        }

        const room = await Room.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true,
        });

        if (!room) {
            return res.status(404).json({
                message: "Room not found",
            });
        }

        res.status(200).json({
            message: "Room updated successfully",
            room,
        });
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: "Invalid room data",
                error: error.message,
            });
        }

        res.status(500).json({
            message: "Failed to update room",
            error: error.message,
        });
    }
};

const deleteRoom = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid room ID",
            });
        }

        const room = await Room.findByIdAndDelete(id);

        if (!room) {
            return res.status(404).json({
                message: "Room not found",
            });
        }

        res.status(200).json({
            message: "Room deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete room",
            error: error.message,
        });
    }
};

export { createRoom, getRooms, getRoomById, updateRoom, deleteRoom };
