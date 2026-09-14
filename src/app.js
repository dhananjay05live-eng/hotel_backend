import express from "express";
import { Hotelrouter } from "./router/hotel.router.js";
import { Roomrouter } from "./router/room.router.js";
import { bookingRouter } from "./router/booking.router.js";

const app = express();

app.use(express.json());
//Hotel router
app.use("/api/v1/hotels", Hotelrouter);

// Room router
app.use("/api/v1/rooms", Roomrouter);

// booking router
app.use("/api/v1/bookings", bookingRouter);

export { app };
