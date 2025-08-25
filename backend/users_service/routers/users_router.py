from fastapi import APIRouter, Depends, Response, Request, HTTPException
from routers.dependencies.to_safe_model import toSafeModel
from routers.dependencies.authentication import getCurrentUser, createToken
from daos.user_dao import getUserDAO
from models.user_model import UserModel
from models.safe_user_model import SafeUserModel
from typing import Optional

router = APIRouter(prefix="/users")

@router.post("/login")
async def login(
		username: str, 
		password: str, 
		response: Response, 
		service: getUserDAO = Depends()
	) -> bool:

	result = await service.validatePassword(username, password)
	if result[0] == True:
		createToken(username, result[1], response)
		return True
	return False

@router.post("/register", response_model=UserModel)
async def register(
		username: str, 
		email: str, 
		password: str,
		account_status: str, 
		response: Response, 
		service: getUserDAO = Depends()
	) -> Optional[UserModel]:

	user = await service.create(
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
async def logout(response: Response) -> None:
	response.delete_cookie(key="access")
	response.delete_cookie(key="refresh")

@router.get("/search")
async def getById(
		id: int = 0, 
		username: str = "", 
		service: getUserDAO = Depends()
	) -> Optional[SafeUserModel]:

	user = await service.getByUsername(username)
	if id != 0: user = await service.getById(id)
	return toSafeModel(user) if user else None

@router.get("/me")
async def getMe(
		me: getCurrentUser = Depends(),
		service: getUserDAO = Depends()
	) -> Optional[SafeUserModel]:

	user = await service.getByUsername(me)
	return toSafeModel(user) if user else None

@router.post("/delete")
async def deleteYourSelf(
		password: str,
		response: Response,
		user: getCurrentUser = Depends(),
		service: getUserDAO = Depends()
	) -> bool:
	
	if await service.validatePassword(user, password):
		service.deleteByUsername(user)
		response.delete_cookie(key="access")
		response.delete_cookie(key="refresh")
		return True
	return False