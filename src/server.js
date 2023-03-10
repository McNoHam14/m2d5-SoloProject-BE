import Express from "express";
import mediaRouter from "./api/media/index.js";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const server = Express();
const port = process.env.PORT || 3003;
const whitelist = [process.env.FE_URL];
// console.log(process.env.FE_URL);

server.use(
  cors({
    origin: (currentOrigin, corsNext) => {
      if (!currentOrigin || whitelist.indexOf(currentOrigin) !== -1) {
        // origin is in the whitelist
        corsNext(null, true);
      } else {
        // origin is not in the whitelist
        corsNext(
          createHttpError(
            400,
            `Origin ${currentOrigin} is not in the whitelist!`
          )
        );
      }
    },
  })
);

server.use(Express.json());

server.use(cors());
server.use("/medias", mediaRouter);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
