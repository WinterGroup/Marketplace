from repositories.order_repository import OrderRepository, getOrderRepository
from models.order_model import OrderModel
from typing import Optional, List

class OrderDAO():
    def __init__(self, repository: OrderRepository) -> None:
        self.repository = repository

    def create(self, order: OrderModel) -> OrderModel:
        return self.repository.create(order)

    def delete(self, id: int) -> OrderModel:
        return self.repository.delete(id)

    def getById(self, id: int) -> OrderModel:
        return self.repository.getById(id)

    def getBySellerId(self, id: int) -> List[OrderModel]:
        return self.repository.getBySellerId(id)

    def getByBuyerId(self, id: int) -> List[OrderModel]:
        return self.repository.getByBuyerId(id)

def getOrderDAO() -> OrderDAO:
    return OrderDAO(getOrderRepository())
