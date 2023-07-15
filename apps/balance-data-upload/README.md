# SC2INFO Balance Data Uploader

https://remix.run/docs/en/1.17.1/utils/parse-multipart-form-data#uploadhandler

## Container

### Build

```powershell
docker build -t balancedata .
```

### Run

```powershell
docker run -it --rm `
    -e AZURE_STORAGE_CONNECTION_STRING=$env:AZURE_STORAGE_CONNECTION_STRING `
    -p 3000:8080 `
    balancedata
```