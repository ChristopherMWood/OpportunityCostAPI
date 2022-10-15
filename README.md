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
# Environment (env) options: dev || prod
docker-compose -f docker-compose.<environment>.yml up --force-recreate --build -d
docker image prune -f
```

## API Endpoint(s)
-- NEEDS TO BE UPDATED for V1.0.0 --
