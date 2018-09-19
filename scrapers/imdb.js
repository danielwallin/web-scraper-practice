import fs from "fs";
import cheerio from "cheerio";
import fetch from "node-fetch";
import { ensureDirectoryExistence } from "./../helpers";

const config = {
  url: "https://www.imdb.com/chart/toptv/?ref_=nv_tvv_250",
  outputPath: "outputs/imdb.json"
};

export const Imdb = () => {
  fetch(config.url)
    .then(res => {
      return res.text();
    })
    .then(data => {
      const $ = cheerio.load(data);
      let arr = [];

      $(".lister-list tr").each((index, el) => {
        const title = $(el)
            .find(".titleColumn a")
            .text(),
          rating = $(el)
            .find(".imdbRating strong")
            .text();
        arr.push({ title, rating });
      });

      ensureDirectoryExistence(config.outputPath);

      fs.writeFileSync(config.outputPath, JSON.stringify(arr, null, 4), {
        encoding: "utf8",
        flag: "w"
      });
    });
};
