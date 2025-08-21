from fastapi import APIRouter, Depends
from daos.order_dao import getOrderDAO
from models.order_model import OrderModel
from routers.dependencies.authentication import getCurrentUser
import requests

router = APIRouter(prefix="/order")

host = "localhost"

@router.get("/{id}")
def getOrder(id: int, service: getOrderDAO = Depends()):
    return service.getById(id)

@router.post("/create")
def createOrder(product_id: int, seller_id: int, user: getCurrentUser = Depends(), service: getOrderDAO = Depends()):
    seller = requests.get("http://localhost:8000/api/users/search", json={"id": seller_id}).json()
    product = requests.get(f"http://localhost:8000/api/products/{id}").json()
    current_user = requests.get(f"http://localhost:8000/api/users/search", json={"username":user}).json()

    if not product or not seller:
        return False

    if seller['account_status'] != "seller":
        return False

    if product['username'] != seller['username']:
        return False    

    order = OrderModel(seller_id=int(seller['id']), buyer_id=current_user.id, product_id=int(product['id']))
    return service.create(order)
