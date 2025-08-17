from fastapi import APIRouter, Depends, HTTPException
from api.v1.dependencies.authentication import getCurrentUser

router = APIRouter()

@router.get('/')
def index(user = Depends(getCurrentUser)):
    # how it works
    return f"welcome, {user}!"