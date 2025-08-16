from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import Request
import jwt
import os
import datetime 

"""

How it works?

every request middleware checks access token status, if access token is empty, 
but refresh token is not empty yet, he generates new access token


"""

class RefreshTokenMiddleware(BaseHTTPMiddleware):
	def dispatch(self, request: Request, call_next):
		response = call_next(request)

		if refresh_token := request.cookies.get("refresh") and request.cookies.get("access") == None:
			username = jwt.decode(refresh_token, os.environ.get("JWT_KEY"), algorithm="HS256")['username']
			new_token = jwt.encode({'username': username}, os.environ.get("JWT_KEY"), algorithm="HS256")
			response.set_cookie(key="access", value=new_token, expires=datetime.now(timezone.utc)+timedelta(hours=7))

		return response