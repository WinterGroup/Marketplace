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
