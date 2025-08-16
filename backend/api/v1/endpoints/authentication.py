from fastapi import APIRouter, Depends, Response
from services.user_service import getUserService
from schemas.user_model import UserModel
from datetime import datetime, timedelta, timezone
from api.v1.dependencies.authentication import *
import jwt
import os

router = APIRouter(prefix="/auth")

@router.post("/login")
def login(username: str, password: str, response: Response, service: getUserService = Depends()):
	if service.validatePassword(username, password):
		createToken(username, response)
		return True
	return False

@router.post("/register", response_model=UserModel)
def register(username: str, email: str, password: str, response: Response, service: getUserService = Depends()):
	user = service.create(UserModel(username=username, email=email, password=password))
	if not user:
		return "User already exists or email already in use."
	# да да я знаю про dependency injection
	createToken(username, response)
	return user

@router.post("/logout")
def logout(response: Response):
	response.delete_cookie(key="access")
	response.delete_cookie(key="refresh")