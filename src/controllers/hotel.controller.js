import mongoose from "mongoose";
import { Hotel } from "../models/hotels.model.js";

const createHotel = async (req, res) => {
    try {
        const { name, location, address, description } = req.body;

        const alreadyCreated = await Hotel.findOne({ name, location, address });
        if (alreadyCreated) {
            return res.status(409).json({ message: "hotel already exists" });
        }
        const hotel = await Hotel.create({
            name,
            location,
            address,
            description,
        });

        return res.status(201).json({
            message: "Hotel created successfully",
            hotel,
        });
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: "Invalid hotel data",
                error: error.message,
            });
        }

        return res.status(500).json({
            message: "Failed to create hotel",
            error: error.message,
        });
    }
};

const getHotels = async (req, res) => {
    try {
        const hotels = await Hotel.find();

        return res.status(200).json({
            hotels,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to fetch hotels",
            error: error.message,
        });
    }
};

const getHotelById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid hotel ID",
            });
        }

        const hotel = await Hotel.findById(id);

        if (!hotel) {
            return res.status(404).json({
                message: "Hotel not found",
            });
        }

        return res.status(200).json({
            hotel,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to fetch hotel",
            error: error.message,
        });
    }
};

const updateHotel = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid hotel ID",
            });
        }

        const allowedFields = ["name", "location", "address", "description"];

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

        const hotel = await Hotel.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true,
        });

        if (!hotel) {
            return res.status(404).json({
                message: "Hotel not found",
            });
        }

        return res.status(200).json({
            message: "Hotel updated successfully",
            hotel,
        });
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: "Invalid hotel data",
                error: error.message,
            });
        }

        return res.status(500).json({
            message: "Failed to update hotel",
            error: error.message,
        });
    }
};

const deleteHotel = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid hotel ID",
            });
        }

        const hotel = await Hotel.findByIdAndDelete(id);

        if (!hotel) {
            return res.status(404).json({
                message: "Hotel not found",
            });
        }

        return res.status(200).json({
            message: "Hotel deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to delete hotel",
            error: error.message,
        });
    }
};

export { createHotel, getHotels, getHotelById, updateHotel, deleteHotel };
