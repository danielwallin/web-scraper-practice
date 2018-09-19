import fs from "fs";
import cheerio from "cheerio";
import fetch from "node-fetch";
import { ensureDirectoryExistence } from "../helpers";

const config = {
  url:
    "https://feber.se/inline/?p=1&globalArtCounterJS=1&first=true&static=true",
  outputPath: "outputs/feber.json"
};

export const Feber = () => {
  fetch(config.url)
    .then(res => {
      return res.text();
    })
    .then(data => {
      const $ = cheerio.load(data);
      let arr = [];

      $(".art_container").each((index, el) => {
        const title = $(el)
            .find("h1 a b")
            .text(),
          description = $(el)
            .find(".text p")
            .text()
            .trim(),
          category = $(el)
            .find(".bodyCat *:not(.visaInte)")
            .text()
            .trim();

        arr.push({ title, description, category });
      });

      ensureDirectoryExistence(config.outputPath);

      fs.writeFileSync(config.outputPath, JSON.stringify(arr, null, 4), {
        encoding: "utf8",
        flag: "w"
      });
    });
};
