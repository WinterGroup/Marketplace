from fastapi import APIRouter, Depends
from services.user_service import getUserService
from api.v1.dependencies.authentication import getCurrentUser
from schemas.safe_user_model import SafeUserModel
from schemas.user_model import UserModel
from api.v1.dependencies.to_safe_model import toSafeModel

router = APIRouter(prefix="/users")

@router.get("/search/id")
def getById(id: int, service: getUserService = Depends()):
	user = service.getById(id)
	return toSafeModel(user) if user else None

@router.get("/search/username")
def getByUsername(username: str, service: getUserService = Depends()):
	user = service.getByUsername(username)
	return toSafeModel(user) if user else None

@router.get("/me")
def getMe(me: getCurrentUser = Depends(), service: getUserService = Depends()):
	user = service.getUserByUsername(me)
	return toSafeModel(user) if user else None
