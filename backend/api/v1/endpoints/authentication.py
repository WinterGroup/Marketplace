from fastapi import APIRouter

router = APIRouter(prefix="/auth")

"""

Authentication router
POST /login
POST /register
POST /logout

"""

@router.post("/login")
def login(username: str, password: str):
	return None

@router.post("/register")
def register(username: str, email: str, password: str):
	return None

@router.post("/logout")
def logout():
	return None