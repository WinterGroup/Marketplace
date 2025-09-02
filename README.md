
<div align="center">
  
<p><h1> 🚀 Marketplace</h1></p>
Opensource marketplace made by intusiasts<b></b>
<div align="center">
<img src="https://img.shields.io/badge/version-0.0.5-blue.svg"> </img>
<img src="https://img.shields.io/badge/license-MIT-green.svg"> </img>
  </div>
</div>

## How to start

build docker-compose.yaml in the root of repository
```
$ sudo docker-compose build
```
to start server
```
$ sudo docker-compose up
```
# 📡 API Documentation

### Users Service

Sign in endpoint
```http
POST /users/login
Content-Type: application/json
Params: username: string, password: string
Raises: HTTP exception 401
{
  true/false
{
response headers: X-Access-Token, X-Refresh-Token
```
Register endpoint
```http
POST /users/register
Content-Type: application/json
Params: username: string, password: string, email: string, account_status: string
Raises: HTTP exception 401, 409
{
  "username": "JohnDoe",
  "password": "encryptedPasswore132434",
  "email": "JohnDoe@mail.com",
  "account_status": "buyer"
{
response headers: X-Access-Token, X-Refresh-Token
```
Sign out endpoint
```http
POST /users/logout
Content-Type: application/json
Headers: X-Access-Token, X-Refresh-Token
Raises: HTTP exception 401
{
  true/false
{
```
Get current user
```http
POST /users/me
Content-Type: application/json
Headers: X-Access-Token, X-Refresh-Token
{
  "username": "JohnDoe",
  "email": "JohnDoe@mail.com",
  "account_status": "buyer"
{
```
Get new Access Token
```http
POST /users/refresh
Content-Type: application/json
Headers: X-Access-Token, X-Refresh-Token
Raises: HTTP exception 401
{
  True
{
Response Headers: X-Access-Token
```
Get user by id/username
```http
POST /users/search
Content-Type: application/json
Params: id (Optional): integer, username (optional): string
Headers: X-Access-Token, X-Refresh-Token
Raises: HTTP exception 401
{
  "username": "JohnDoe",
  "email": "JohnDoe@mail.com",
  "account_status": "buyer"
{
Response Headers: X-Access-Token
```
### Product Service
Get all products
```http
POST /products/
Content-Type: application/json
{
  "id": "1",
  "username": "JohnDoe",
  "price": 100,
  "created_at": "01/01/2025"
  "category": "item"
  "is_active": true
{
{
  "id": "2",
  "username": "JohnDoe123",
  "price": 1002,
  "created_at": "01/05/2025"
  "category": "item"
  "is_active": true
{
```
Search product by username/id
```http
POST /products/search
Content-Type: application/json
Params: username (optional): string, id (optional): int
Searching by username example
{
  "id": "1",
  "username": "JohnDoe",
  "price": 100,
  "created_at": "01/01/2025"
  "category": "item"
  "is_active": true
{
{
  "id": "2",
  "username": "JohnDoe",
  "price": 1002,
  "created_at": "01/05/2025"
  "category": "item"
  "is_active": true
{
```
