docker build -f Dockerfile -t discordbuilders . --no-cache --progress=plain
docker run -it --name discordbuilders --rm discordbuilders
