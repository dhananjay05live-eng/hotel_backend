import express from "express";
import { Hotelrouter } from "./router/hotel.router.js";
import { Roomrouter } from "./router/room.router.js";

const app = express();

//Hotel router
app.use("api/v1/hotels", Hotelrouter);

// Room router
app.use("api/v1/rooms", Roomrouter);

export { app };
