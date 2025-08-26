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

def createNewRefresh(username: str) -> str:
	return jwt.encode(
		{
			'username': username, 
			"type": "refresh"
		}, 
		os.environ.get("JWT_KEY"), algorithm="HS256"
	)

def createNewAccess(refresh_token: str) -> str:
	try:
		data = jwt.decode(
			refresh_token, 
			os.environ.get("JWT_KEY"), 
			algorithms="HS256"
		)
		access_token = jwt.encode(
			{
				'username': data['username']
			}, 
			os.environ.get("JWT_KEY"), algorithm="HS256"
		)
		return access_token
	except jwt.PyJWTError:
		raise HTTPException(status=401, detail="Validation Error")
