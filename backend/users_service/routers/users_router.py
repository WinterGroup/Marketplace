from fastapi import APIRouter, Depends, Response, Request
from routers.dependencies.to_safe_model import toSafeModel
from routers.dependencies.authentication import getCurrentUser, createToken
from daos.user_dao import getUserDAO
from models.user_model import UserModel

router = APIRouter(prefix="/users")

@router.post("/login")
def login(username: str, password: str, response: Response, service: getUserDAO = Depends()):
	if service.validatePassword(username, password):
		createToken(username, response)
		return True
	return False

@router.post("/register", response_model=UserModel)
def register(username: str, email: str, password: str,account_status: str, response: Response, service: getUserDAO = Depends()):
	user = service.create(UserModel(username=username, email=email, password=password, account_status=account_status))
	if not user:
		return "User already exists or email already in use."
	createToken(username, response)
	return user

@router.post("/logout")
def logout(response: Response):
	response.delete_cookie(key="access")
	response.delete_cookie(key="refresh")

@router.get("/search")
def getById(id: int, service: getUserDAO = Depends()):
	user = service.getById(id)
	return toSafeModel(user) if user else None

@router.get("/get/{username}")
def getByUsername(username: str, service: getUserDAO = Depends()):
	user = service.getByUsername(username)
	return toSafeModel(user) if user else None

@router.get("/me")
def getMe(me: getCurrentUser = Depends(), service: getUserDAO = Depends()):
	user = service.getByUsername(me)
	return toSafeModel(user) if user else None
