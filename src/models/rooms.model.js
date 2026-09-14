import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
    {
        hotel: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Hotel",
            required: true,
        },

        roomNumber: {
            type: String,
            required: true,
            trim: true,
        },

        type: {
            type: String,
            required: true,
            enum: ["Single", "Double", "Deluxe", "Suite"],
        },

        pricePerNight: {
            type: Number,
            required: true,
            min: 0,
        },

        capacity: {
            type: Number,
            required: true,
            min: 1,
        },
    },
    { timestamps: true },
);

const Room = mongoose.model("Room", roomSchema);
export { Room };
