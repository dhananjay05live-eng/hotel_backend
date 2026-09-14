import { Router } from "express";

import {
    createRoom,
    getRooms,
    getRoomById,
    updateRoom,
    deleteRoom,
} from "../controllers/room.controller.js";

const Roomrouter = Router();

Roomrouter.post("/", createRoom);
Roomrouter.get("/", getRooms);
Roomrouter.get("/:id", getRoomById);
Roomrouter.patch("/:id", updateRoom);
Roomrouter.delete("/:id", deleteRoom);

export { Roomrouter };
