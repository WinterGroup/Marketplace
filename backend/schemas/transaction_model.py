from pydantic import BaseModel

class TransactionModel(BaseModel):
	first_user: str
	second_user: str
	price: float
	product_id: int
