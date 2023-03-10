import fs from "fs-extra";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const { readJSON, writeJSON, writeFile } = fs;

const mediasJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../data/media.json"
);

// console.log("A", process.cwd());
// export const publicFolderPath = join(process.cwd(), "")

// console.log("A", process.cwd());
// export const publicFolderPath = join(process.cwd(), "./public/img/authors");

// const authorImagePath = join(publicFolderPath, "../api/authors");

// const blogPostImagePath = join(publicFolderPath, "../api/blogPosts");

export const getMedias = () => readJSON(mediasJSONPath);
export const writeMedias = (medias) => writeJSON(mediasJSONPath, medias);
