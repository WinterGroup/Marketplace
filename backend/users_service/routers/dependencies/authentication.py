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
		if token := request.cookies.get('access'):
			return jwt.decode(token, os.environ.get("JWT_KEY"), algorithms="HS256")["username"]
		raise exc
	except jwt.PyJWTError:
		raise exc


def createToken(username: str, response: Response):
	access_token = jwt.encode({"username": username, "type": "bearer"}, os.environ.get("JWT_KEY"), algorithm="HS256")
	refresh_token = jwt.encode({"username": "username", "type": "refresh_token"}, os.environ.get("JWT_KEY"), algorithm="HS256")
	response.set_cookie(key="access", value=access_token, expires=datetime.now(timezone.utc)+timedelta(hours=7))
	response.set_cookie(key="refresh", value=refresh_token, expires=datetime.now(timezone.utc)+timedelta(days=7))
	return access_token