import { app } from "./app.js";
import { connectDB } from "./database/index.js";

connectDB().then(
    app.listen(process.env.PORT || 8000, () => {
        console.log(`process is running at port: ${process.env.PORT}`);
    }),
);
