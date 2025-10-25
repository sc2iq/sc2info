# SC2INFO-UI

User Interface for SC2INFO.api.

Search and Browse StarCarft 2 Units, Buildings, Upgrades, and more!

## Running Locally

### Build

```powershell
docker build -t sc2info .
```

### Run

```powershell
docker run -it --rm \
    -e BALANCE_DATA_JSON_URL=$BALANCE_DATA_JSON_URL \
    -e ICONS_CONTAINER_URL=$ICONS_CONTAINER_URL \
    -p 3000:8080 \
    sc2info
```

## Deployment

[See Deploy Scripts](../../scripts/deploy.ps1)
