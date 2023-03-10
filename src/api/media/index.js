import Express from "express";
import uniqid from "uniqid";
import { getMedias, writeMedias } from "../../lib/fs-tools.js";
import multer from "multer";
import { extname, join, dirname } from "path";
import { write } from "fs";
import { fileURLToPath } from "url";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, coverJSONPath);
  },

  filename: function (req, file, cb) {
    const filename = req.params.id + extname(file.originalname);
    cb(null, filename);

    // filename: function (req, file, cb) {
    //   const originalFileExtension = extname(file.originalname);
    //   cb(null, req.params.imdbID + originalFileExtension);
  },
});

const upload = multer({ storage: storage });

const coverJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../../public/img/posters"
);

const mediaRouter = Express.Router();

// POST Media

mediaRouter.post("/", async (req, res) => {
  // have req.body data - single media
  req.body.imdbID = uniqid();

  // store data in JSON file - push back to file which is list of medias
  const medias = await getMedias();
  medias.push(req.body);

  // write back to file
  await writeMedias(medias);

  // send media created
  res.send(req.body);
});

// GET Media (list)

mediaRouter.get("/", async (req, res) => {
  const medias = await getMedias();
  res.send(medias);
});

// GET Media (single)

mediaRouter.get("/:id", async (req, res) => {
  try {
    const medias = await getMedias();
    const foundMedias = medias.find((media) => media.id === req.params.imdbID);
    console.log(foundMedias);
    if (foundMedias) {
      res.send(foundMedias);
    }
  } catch (error) {}
});

// /medias/:id/poster
// POST Upload poster to single media

mediaRouter.post(
  "/:id/poster",
  upload.single("poster"),
  async (req, res, next) => {
    try {
      const medias = await getMedias();
      const index = medias.findIndex((media) => media.id === req.params.imdbID);
      if (index !== -1) {
        const filename = req.params.imdbID + extname(req.file.originalname);
        medias[index] = {
          ...medias[index],
          posters: `http://localhost:3003`,
        };
        await writeMedias(medias);
        res.send({ message: `${req.params.id} poster uploaded` });
      } else {
        next(error);
      }
    } catch (error) {
      next(error);
    }
  }
);

export default mediaRouter;
