from fastapi import APIRouter, Depends, Response, Request, HTTPException
from routers.dependencies.to_safe_model import toSafeModel
from routers.dependencies.authentication import getCurrentUser, createNewRefresh, createNewAccess
from daos.user_dao import getUserDAO
from models.user_model import UserModel
from models.safe_user_model import SafeUserModel
from models.refresh_model import RefreshModel
from daos.session_dao import getSessionDAO
from typing import Optional
import secrets

router = APIRouter(prefix="/users")

@router.post("/login")
async def login(
		username: str, 
		password: str, 
		response: Response,
		request: Request, 
		service: getUserDAO = Depends(),
		session: getSessionDAO = Depends()
	) -> bool:

	result = await service.validatePassword(username, password)

	if request.headers.get("X-Refresh-Token"):
		raise HTTPException(status_code=401, detail="logout first")

	if result[0]:
		refresh = createNewRefresh(username)
		access = createNewAccess(refresh)

		new_session = RefreshModel(
			hash=str(secrets.token_hex(16)), 
			token=refresh
		)

		await session.create(new_session)
		response.headers['X-Access-Token'] = access
		response.headers['X-Refresh-Token'] = new_session.hash
		return True

	return False

@router.post("/register", response_model=UserModel)
async def register(
		username: str, 
		email: str, 
		password: str,
		account_status: str, 
		request: Request,
		response: Response, 
		service: getUserDAO = Depends(),
		session: getSessionDAO = Depends()
	) -> Optional[UserModel]:
	
	if request.headers.get("X-Refresh-Token"):
		raise HTTPException(status_code=401, detail="logout first")

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

	refresh = createNewRefresh(username)
	access = createNewAccess(refresh)

	new_session = RefreshModel(
		hash=str(secrets.token_hex(16)), 
		token=refresh
	)

	await session.create(new_session)
	response.headers['X-Access-Token'] = access
	response.headers['X-Refresh-Token'] = new_session.hash
	return user

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

"""
@router.post("/delete")
async def deleteYourSelf(
		password: str,
		response: Response,
		user: getCurrentUser = Depends(),
		service: getUserDAO = Depends()
	) -> bool:
	
	if await service.validatePassword(user, password):
		await service.deleteByUsername(user)
		return True
	return False
"""

@router.get("/refresh")
async def refresh(
		request: Request,
		response: Response,
		session: getSessionDAO = Depends()
	) -> Optional[bool]:

	token = request.headers.get('X-Refresh-Token')
	if not token:
		raise HTTPException(status_code=401, detail="unauthorized")
	item = await session.getByHash(token)
	if item:
		access_token = createNewAccess(item.token)
		response.headers['X-Access-Token'] = access_token
		return True
	raise HTTPException(status_code=401, detail="Wrong refresh token")
@router.post("/logout")
async def logout(
		request: Request,
		session: getSessionDAO = Depends()
	) -> Optional[bool]:
	
	refresh_hash = request.headers.get("X-Refresh-Token")
	if not refresh_hash:
		raise HTTPException(status_code=401, detail="unauthorized")
	session.delete(refresh_hash)
	return True