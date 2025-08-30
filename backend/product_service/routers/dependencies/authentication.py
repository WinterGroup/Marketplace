from fastapi import	HTTPException, Request
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
			return jwt.decode(token, str(os.environ.get("JWT_KEY")), algorithms="HS256")["username"]
		raise exc
	except jwt.PyJWTError:
		raise exc
