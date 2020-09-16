import { promises as fs } from "fs";
import path from "path";

const ROOT_DIR="/home/justink/Public/Videos/TV/Modern Family"

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
    episode: "",
    extension: "",
  };
};

const main = async () => {
  const showData = await getShowData("modern_family.json");
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
      console.log({ currentTitle: path.join(seasonDirectory, currentTitle), newTitle: path.join(seasonDirectory, newTitle) });
      // await fs.rename(currentTitle, newTItle)
    });
  });
};

main();
