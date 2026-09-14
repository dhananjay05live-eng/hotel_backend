import { Router } from "express";

import {
    createHotel,
    getHotels,
    getHotelById,
    updateHotel,
    deleteHotel,
} from "../controllers/hotel.controller.js";

const Hotelrouter = Router();

Hotelrouter.post("/", createHotel);
Hotelrouter.get("/", getHotels);
Hotelrouter.get("/:id", getHotelById);
Hotelrouter.patch("/:id", updateHotel);
Hotelrouter.delete("/:id", deleteHotel);

export { Hotelrouter };
