from fastapi import APIRouter, Depends
from daos.order_dao import getOrderDAO
from models.order_model import OrderModel
from routers.dependencies.authentication import getCurrentUser
import requests

router = APIRouter(prefix="/order")

@router.get("/search")
async def getOrder(id: int, service: getOrderDAO = Depends()):
    return await service.getById(id)


# VERYYY DANGEROUS CODE
@router.post("/create")
async def createOrder(product_id: int, seller_id: int, user: getCurrentUser = Depends(), service: getOrderDAO = Depends()):
    return "bad code was here"