## How to start

build docker-compose.yaml in the root of repository
```
$ sudo docker-compose build
```
to start server
```
$ sudo docker-compose up
```
# All routes
## Users Service

```
  POST /api/users/login
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `username` | `string` | **Required**       |
| `password` | `string` | **Required**       |

```
  POST /api/users/register
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `username` | `string` | **Required**       |
| `password` | `string` | **Required**       |
| `email` | `string` | **Required**       |
| `accounts_status` | `seller/buyer` | **Required**       |

```
  GET /api/users/me
```
show current profile

```
  GET /api/users/refresh
```
get new access token

```
  POST /api/users/logout
```
log out from current user

```
  GET /api/users/search
```
search users

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `username` | `string` | **optional**       |
| `id` | `int` | **optional**       |

## Products Service
```
  GET /api/products/search
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `username` | `string` | **optional**       |
| `id` | `int` | **optional**       |
```
  POST /api/products/create
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `description` | `string` | **required**       |
| `price` | `int` | **required**       |
| `category` | `string` | **required**       |
```
  GET /api/products/
```
get all products
