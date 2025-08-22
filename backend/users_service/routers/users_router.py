from fastapi import APIRouter, Depends, Response, Request, HTTPException
from routers.dependencies.to_safe_model import toSafeModel
from routers.dependencies.authentication import getCurrentUser, createToken
from daos.user_dao import getUserDAO
from models.user_model import UserModel
from typing import Optional

router = APIRouter(prefix="/users")

@router.post("/login")
def login(
		username: str, 
		password: str, 
		response: Response, 
		service: getUserDAO = Depends()
	) -> bool:

	result = service.validatePassword(username, password)
	if result[0] == True:
		createToken(username, result[1], response)
		return True
	return False

@router.post("/register", response_model=UserModel)
def register(
		username: str, 
		email: str, 
		password: str,
		account_status: str, 
		response: Response, 
		service: getUserDAO = Depends()
	) -> Optional[UserModel]:

	user = service.create(
		UserModel(
			username=username, 
			email=email, 
			password=password, 
			account_status=account_status
		)
	)

	if not user:
		raise HTTPException(status_code=409, detail="user already exists")
	createToken(username, account_status, response)
	return user

@router.post("/logout") 
def logout(response: Response) -> None:
	response.delete_cookie(key="access")
	response.delete_cookie(key="refresh")

@router.get("/search")
def getById(
		id: int = 0, 
		username: str = "", 
		service: getUserDAO = Depends()
	) -> Optional[UserModel]:

	user = service.getByUsername(username)
	if id != 0: user = service.getById(id)
	return toSafeModel(user) if user else None

@router.get("/me")
def getMe(
		me: getCurrentUser = Depends(),
		service: getUserDAO = Depends()
	) -> Optional[UserModel]:

	user = service.getByUsername(me)
	return toSafeModel(user) if user else None
