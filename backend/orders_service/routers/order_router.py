from fastapi import APIRouter, Depends
from daos.order_dao import getOrderDAO
from models.order_model import OrderModel
import httpx

router = APIRouter(prefix="/order")

host = "localhost"

@router.get("/{id}")
def getOrder(id: int, service: getOrderDAO = Depends()):
    return service.getById(id)
