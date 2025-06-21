docker build -t my-app .
echo Docker image is created!
docker run --name words-game-container -d -p 27017:27017 my-app
echo Docker Container is created!
docker start
echo Docker is starting... 