## Project Setup
1. Install docker
2. Create ```.env``` file with the following environment variables
```
NODE_ENV=development  #make production for request caching
GOOGLE_API_KEY={Google API key here}
```
3. Run ```docker-compose up -d```

### Docker Options
- To watch all logs: ```docker-compose logs -f```
- To watch specific image logs: ```docker-compose logs -f <image name>```
- To Rebuild from scratch
```
docker-compose up --force-recreate --build -d
docker image prune -f
```

### Available node Commands (outside of docker)
- To run server: ```npm start```
- To debug Server: ```npm run-script debug```
- To run all tests: ```npm test```

### Running Docker
Environment (env) options: dev || prod

- ```docker-compose -f docker-compose.<environment>.yml up```
- ```docker-compose -f docker-compose.<environment>.yml up --force-recreate --build -d```
- ```docker-compose -f docker-compose.<environment>.yml down```


## API Endpoint(s)
Backend API for https://www.opportunitycost.life that takes a YouTube video URL and calculates how much time has been spent by all viewers combined to watch that video. Started as a joke and turned into this in the end.

### **GET** - YouTube Video Opportunity Cost 

**Request URL:** {base_url}/api/opportunityCost/{YouTube Video ID}
```**Note:** YouTube URL parameter must be URL encoded```

**Response**
```
{
    views: total views for the video,
    totalSeconds: total seconds watched by all people,
    formattedTime: {
        centuries:,
        decades:,
        years:,
        months:,
        days:
        hours:
        seconds:,
        minutes:
    }
}
```
