from sqlalchemy import Column, String, Integer
from db.session import Base
class OrderTable(Base):
    __tablename__="orders"
    id = Column(Integer, primary_key=True)
    seller_id = Column(Integer, nullable=False)
    buyer_id = Column(Integer, nullable=False)
    product_id = Column(Integer, nullable=False)
    def __repr__(self):
        return {
            "id": self.id,
            "seller":self.seller_id,
            "buyer": self.buyer_id,
            "product_id": self.product_id
        }
        
