import json

FILENAME = "modern_family.json"

def strip_quotes(string: str) -> str:
    return string.replace('"', "")

with open(FILENAME) as f:
    data = json.load(f)

for season in data:
    for episode in season["episodes"]:
        episode["title"] = strip_quotes(episode["title"])

with open(FILENAME, "w") as f:
    json.dump(data, f, indent=2)