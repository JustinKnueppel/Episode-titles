import { promises as fs } from "fs";

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
  const match = filename.match(/^.*S\d+E(\d+).*\.(.+)$/);
  if (match) {
    return {
      episode: match[0],
      extension: match[1],
    };
  }
  return {
    episode: "",
    extension: "",
  };
};

const main = async () => {
  const showData = await getShowData("modern_family.json");
  showData.forEach(async (season) => {
    process.chdir(`Season ${season}`);
    const currentTitles = await fs.readdir(".");
    currentTitles.forEach(async (currentTitle) => {
      const { episode, extension } = getEpisodeAndExtension(currentTitle);
      const episodeTitle = season.episodes.find(
        (e) => e.episode === Number(episode)
      )?.title;
      const newTitle = `Episode ${episode} - ${episodeTitle}.${extension}`;
      console.log({ currentTitle, newTitle });
      // await fs.rename(currentTitle, newTItle)
    });
    process.chdir("..");
  });
};

main();
