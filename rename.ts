import { promises as fs } from "fs";
import path from "path";

const ROOT_DIR = "/home/justin/Shares/Media/Videos/TV/The Big Bang Theory";

interface Episode {
  episode: Number;
  title: string;
}

interface Season {
  season: Number;
  episodes: Array<Episode>;
}

const getShowData = async (filename: string): Promise<Array<Season>> => {
  const data = await fs.readFile(filename);
  return JSON.parse(data.toString());
};

const getEpisodeAndExtension = (
  filename: string
): { episode: string; extension: string } => {
  const match = filename.match(/^.*[sS]\d+[eE](\d+).*\.(.+)$/);
  if (match) {
    return {
      episode: match[1],
      extension: match[2],
    };
  }
  return {
    episode: filename.split(".")[0],
    extension: filename.split(".")[1],
  };
};

const main = async () => {
  const showData = await getShowData("tbbt.json");
  process.chdir(ROOT_DIR);
  showData.forEach(async (season) => {
    const seasonString = season.season < 10 ? `0${season.season}` : season.season.toString();
    const seasonDirectory = `Season ${seasonString}`;
    const currentTitles = await fs.readdir(seasonDirectory);
    currentTitles.forEach(async (currentTitle) => {
      const { episode, extension } = getEpisodeAndExtension(currentTitle);
      const episodeTitle = season.episodes.find(
        (e) => e.episode === Number(episode)
      )?.title;
      const newTitle = `Episode ${episode} - ${episodeTitle}.${extension}`;
      const currentFullpath = path.join(seasonDirectory, currentTitle);
      const newFullpath = path.join(seasonDirectory, newTitle);
      console.log({ currentFullpath, newFullpath });
      // await fs.rename(currentFullpath, newFullpath);
    });
  });
};

main();
