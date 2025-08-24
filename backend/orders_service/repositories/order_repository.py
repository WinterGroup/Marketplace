from db.session import session, connection
from typing import Optional, List
from models.order_model import OrderModel
from tables.order_table import OrderTable
from sqlalchemy import select
import sqlalchemy 

class OrderRepository():
    def __init__(self, session) -> None:
        self.session = session

    @connection
    async def create(self, order: OrderModel) -> OrderModel:
        await self.session.add(OrderTable(**order.dict()))
        await self.session.commit()
        return order

    @connection
    async def delete(self, id: int) -> bool:
        order = await self.session.get(OrderTable, id)
        if order:
            await self.session.delete(order)
            await self.session.commit()
            return True
        return False

    @connection
    async def getById(self, id: int) -> Optional[OrderModel]:
        order = await self.session.get(OrderTable, id)
        return order if order else None

    @connection
    async def getBySellerId(self, id: int) -> List[OrderModel]:
        result = await self.session.execute(select(OrderTable).where(OrderTable.seller_id==id))
        return result.scallar_one_or_none()

    @connection
    async def getByBuyerId(self, id: int) -> List[OrderModel]:
        result = await self.session.execute(select(OrderTable).where(OrderTable.buyer_id==id))
        return result.scallar_one_or_none()
            
        
def getOrderRepository() -> OrderRepository:
    return OrderRepository(session)
