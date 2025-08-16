## How to start

build docker-compose.yaml in the root of repository
```
$ sudo docker-compose build
```
to start server
```
$ sudo docker-compose up
```

### How whole app works?

<img width="300" height="300" alt="image" src="https://github.com/user-attachments/assets/7009dd52-1f38-47e6-a9ec-f2c15a87b990" />

Frontend-side <-DTO-> endpoints <-DTO-> services <-DTO-> repositories <-DTO-> databases

Every element is linked to each other, for example, you cant work right with repositories from endpoints.

**Frontend-** - HTML, CSS and next.js application for client side (interface)

**endpoints** - API endpoints, for example /login.

**services** - repositories abstract layer

**repositories** - business logic, working with database classes

**databases** - NoSQL databases like - redis, MongoDB and SQL like posgreSQL, sqlite.

**DTO** - Data Transfer Object, for safe data travelling around app.


## Authentication endpoints

#### login into user

```http
  POST /api/auth/login
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `username` | `string` | **Required**       |
| `password` | `string` | **Required**       |

#### log out from user
```http
  POST /api/auth/logout
```

### register

```http
  POST /api/auth/register
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `username` | `string` | **Required**       |
| `email` | `string` | **Required**       |
| `password` | `string` | **Required**       |
