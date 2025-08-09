from fastapi import APIRouter, Depends
from services.user_service import getUserService
from schemas.user_model import UserModel
router = APIRouter(prefix="/auth")

@router.post("/login")
def login(username: str, password: str, service: getUserService = Depends()):
	return service.validatePassword(username, password)

@router.post("/register")
def register(username: str, email: str, password: str, service: getUserService = Depends()):
	user = service.create(UserModel(username=username, email=email, password=password))
	if not user:
		return "User already exists"
	return user

@router.post("/logout")
def logout():
	return None