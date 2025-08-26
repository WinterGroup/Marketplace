from fastapi import	HTTPException, Request, Response
from datetime import datetime, timezone, timedelta
import jwt
import os

def getCurrentUser(request: Request):
	exc = HTTPException(
		status_code=401,
		detail="Unauthorized",
		headers={"WWW-Authenticate": "Bearer"}
	)
	try:	
		if token := request.headers.get("X-Access-Token"):
			return jwt.decode(token, os.environ.get("JWT_KEY"), algorithms="HS256")["username"]
		raise exc
	except jwt.PyJWTError:
		raise exc


def createToken(username: str, account_status: str, response: Response):
	access_token = jwt.encode({"username": username, "type": "bearer", "account_status": account_status}, os.environ.get("JWT_KEY"), algorithm="HS256")
	refresh_token = jwt.encode({"username": "username", "type": "refresh_token"}, os.environ.get("JWT_KEY"), algorithm="HS256")
	return {'access': access_token, 'refresh': refresh_token}