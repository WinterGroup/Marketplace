from fastapi import	HTTPException, Request, Response
import jwt
import os
from datetime import datetime, timezone, timedelta

def getCurrentUser(request: Request):
	exc = HTTPException(status_code=401,
					    detail="Unauthorized",
					    headers={"WWW-Authenticate": "Bearer"})
	try:	
		if token := request.cookies.get('jwt'):
			return jwt.decode(token, os.environ.get("JWT_KEY"), algorithms="HS256")["username"]
		raise exc
	except jwt.PyJWTError:
		raise exc


def createToken(username: str, response: Response):
	token = jwt.encode({"username": username}, os.environ.get("JWT_KEY"), algorithm="HS256")
	response.set_cookie(key="jwt", value=token, expires=datetime.now(timezone.utc)+timedelta(hours=7), httponly=True)
	return token