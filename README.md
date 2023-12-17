# Health Tracker API
[<img src="https://run.pstmn.io/button.svg" alt="Run In Postman" style="width: 128px; height: 32px;">](https://app.getpostman.com/run-collection/29783720-a7ae164e-6cf4-4e21-b2b8-d54854e74fc0?action=collection%2Ffork&source=rip_markdown&collection-url=entityId%3D29783720-a7ae164e-6cf4-4e21-b2b8-d54854e74fc0%26entityType%3Dcollection%26workspaceId%3Dee12a055-48e5-4c75-a31c-b77f7e1dd1a5#?env%5BHealth%20Tracker%20API%5D=W3sia2V5IjoiSE9TVCIsInZhbHVlIjoiaHR0cDovL2xvY2FsaG9zdDo4MDgwLyIsImVuYWJsZWQiOnRydWUsInR5cGUiOiJkZWZhdWx0In1d)

## Installation

```bash
$ npm install
```

## Running the app locally

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

### Requirements
* NodeJs 21.1.0
* PostgreSQL  14 or Later

## Running the app with Docker
### Check .env file and specify port that not in use on your machine now. Edit Dockerfile nad docker-compose.yml too. 
```bash
# For Ubuntu Linux Docker Compose version from sources
sudo docker compose up --build

# For non root users (if have privileges)
docker compose up --build
```

### Requirements
* Running Docker Engine
* Docker Compose v2.21.0 or Later
