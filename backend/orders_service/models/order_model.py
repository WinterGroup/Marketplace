from pydantic import BaseModel

class OrderModel(BaseModel):
    seller_id: int
    buyer_id: int
    product_id: int
