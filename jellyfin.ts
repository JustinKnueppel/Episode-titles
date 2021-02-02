import { promises as fs } from "fs";
import path from "path";

const ROOT_DIR = "/home/justin/Media/TV/How I Met Your Mother";
const SEASON_COUNT = 9;


const firstNInts = (n: number, start: number = 0): Array<number> => {
  return Array.from({length: n}, (_, i) => i + start);
}

const getEpisodeAndExtension = (
  filename: string
): { episode: number; extension: string } => {
  const match = filename.match(/^.*Episode\s*(\d+).*\.(.+)$/);
  if (match) {
    return {
      episode: parseInt(match[1]),
      extension: match[2],
    };
  }
  return {
    episode: -1,
    extension: filename.split(".")[1],
  };
};

const main = async () => {
  process.chdir(ROOT_DIR);
  const seasonNumbers = firstNInts(SEASON_COUNT, 1);
  seasonNumbers.forEach(async (season) => {
    const seasonString = season.toString().padStart(2, "0");
    const seasonDirectory = `Season ${seasonString}`;
    const currentTitles = await fs.readdir(seasonDirectory);
    currentTitles.forEach(async (currentTitle) => {
      const { episode, extension } = getEpisodeAndExtension(currentTitle);
      const episodeString = episode.toString().padStart(2, "0");
      const newTitle = `Episode S${seasonString}E${episodeString}.${extension}`;
      const currentFullpath = path.join(seasonDirectory, currentTitle);
      const newFullpath = path.join(seasonDirectory, newTitle);
      console.log({ currentFullpath, newFullpath });
      // await fs.rename(currentFullpath, newFullpath);
    });
  });
};

main();
