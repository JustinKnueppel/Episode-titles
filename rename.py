import json
import os
import re
from typing import List

ROOT = "."
SEASON_COUNT = 11
DATA_FILE = "modern_family.json"

def padded_number(num: int, padding: int = 2) -> str:
    strlen = len(str(num))
    difference = padding - strlen
    return f"{'0'*difference}{num}" if difference > 0 else str(num)

def number_and_extension(title: str) -> str:
    regex = re.compile(r'^.*[sS]\d{1,2}[eE](\d{1,2}).*\.(\w+)$')
    match = regex.match(title)
    if match:
        return match[0], match[1]
    return None

def new_title(title: str, episode_list: List) -> str:
    episode, extension = number_and_extension(title)
    episode_title = next(x["title"] for x in episode_list if x["episode"] == int(episode))
    return f'Episode {episode} - {episode_title}.{extension}'

def main() -> None:
    with open(DATA_FILE) as f:
        show_data = json.load(f)

    for season_data in show_data:
        os.chdir(f'Season {padded_number(season_data["season"])}')
        current_titles = os.listdir('.')
        for current_title in current_titles:
            corrected_title  = new_title(current_title, season_data["episodes"])
            print(current_title, corrected_title)
            # os.rename(current_title, corrected_title)
        os.chdir('..')

if __name__ == "__main__":
    main()
