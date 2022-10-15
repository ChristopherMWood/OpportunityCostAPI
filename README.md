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

-- NEEDS TO BE UPDATED SOON (Currently out of date) --
Backend API for <https://www.opportunitycost.life> that takes a YouTube video URL and calculates how much time has been spent by all viewers combined to watch that video. Started as a joke and turned into this in the end.

### **GET** - YouTube Video Opportunity Cost

**Request URL:** {base_url}/api/opportunityCost/{YouTube Video ID}
```**Note:** YouTube URL parameter must be URL encoded```

**Example Response**

```
{
    "videoMeta": {
        "id": "9bZkp7q19f0",
        "title": "PSY - GANGNAM STYLE(강남스타일) M/V",
        "views": "4506086155",
        "likes": "25331747",
        "length": 253,
        "opportunityCost": 1140039797215,
        "publishDate": "2012-07-15T07:46:32Z",
        "thumbnails": {
            "default": {
                "url": "https://i.ytimg.com/vi/9bZkp7q19f0/default.jpg",
                "width": 120,
                "height": 90
            },
            "medium": {
                "url": "https://i.ytimg.com/vi/9bZkp7q19f0/mqdefault.jpg",
                "width": 320,
                "height": 180
            },
            "high": {
                "url": "https://i.ytimg.com/vi/9bZkp7q19f0/hqdefault.jpg",
                "width": 480,
                "height": 360
            },
            "standard": {
                "url": "https://i.ytimg.com/vi/9bZkp7q19f0/sddefault.jpg",
                "width": 640,
                "height": 480
            },
            "maxres": {
                "url": "https://i.ytimg.com/vi/9bZkp7q19f0/maxresdefault.jpg",
                "width": 1280,
                "height": 720
            }
        }
    },
    "channelMeta": {
        "id": "UCrDkAvwZum-UTjHmzDI2iIw",
        "name": "officialpsy",
        "creationDate": null,
        "thumbnails": null
    }
}
```
