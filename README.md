
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
