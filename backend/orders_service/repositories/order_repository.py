from db.session import session, connection
from typing import Optional, List
from models.order_model import OrderModel
from tables.order_table import OrderTable

class OrderRepository():
    def __init__(self, session) -> None:
        self.session = session

    @connection
    def create(self, order: OrderModel) -> OrderModel:
        self.session.add(OrderTable(**order.dict()))
        self.session.commit()
        return order

    @connection
    def delete(self, id: int) -> bool:
        order = self.session.query(OrderTable).filter_by(id=id).first()
        if order:
            self.session.delete(order)
            self.session.commit()
            return True
        return False

    @connection
    def getById(self, id: int) -> Optional[OrderModel]:
        order = self.session.query(OrderTable).filter_by(id=id).first()
        return order if order else None

    @connection
    def getBySellerId(self, id: int) -> List[OrderModel]:
        return self.session.query(OrderTable).filter_by(seller_id=id).all()

    @connection
    def getByBuyerId(self, id: int) -> List[OrderModel]:
        return self.session.query(OrderTable).filter_by(buyer_id=id).all()
            
        
def getOrderRepository() -> OrderRepository:
    return OrderRepository(session)
