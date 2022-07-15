## Project Setup
1. Install Node.js
2. (optional) Install Redis and run in background when NODE_ENV = production
2. Run ```npm install```
4. Create ```.env``` file with the following environment variables
```
NODE_ENV=development  #make production for request caching
PORT={port # here}
GOOGLE_API_KEY={Google API key here}
```

### Available Commands
- To start Server: ```npm start```
- To debug Server: ```npm run-script debug```
- To run all tests: ```npm test```

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
