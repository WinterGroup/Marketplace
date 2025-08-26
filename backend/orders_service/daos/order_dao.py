from repositories.order_repository import OrderRepository, getOrderRepository
from models.order_model import OrderModel
from typing import Optional, List

class OrderDAO():
    def __init__(self, repository: OrderRepository) -> None:
        self.repository = repository

    async def create(self, order: OrderModel) -> OrderModel:
        return await self.repository.create(order)

    async def delete(self, id: int) -> OrderModel:
        return await self.repository.delete(id)

    async def getById(self, id: int) -> OrderModel:
        return await self.repository.getById(id)

    async def getBySellerId(self, id: int) -> List[OrderModel]:
        return await self.repository.getBySellerId(id)

    async def getByBuyerId(self, id: int) -> List[OrderModel]:
        return await self.repository.getByBuyerId(id)

def getOrderDAO() -> OrderDAO:
    return OrderDAO(getOrderRepository())
