import { Router } from "express";

import {
    createBooking,
    getBookings,
    getBookingById,
    updateBooking,
    cancelBooking,
    deleteBooking,
} from "../controllers/booking.controller.js";

const bookingRouter = Router();

bookingRouter.post("/rooms/:roomId", createBooking);

bookingRouter.get("/", getBookings);
bookingRouter.get("/:id", getBookingById);

bookingRouter.patch("/:id", updateBooking);
bookingRouter.patch("/:id/cancel", cancelBooking);

bookingRouter.delete("/:id", deleteBooking);

export { bookingRouter };
