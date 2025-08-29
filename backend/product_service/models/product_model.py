from pydantic import BaseModel
from datetime import datetime


class ProductModel(BaseModel):
	username: str
	description: str
	price: int
	created_at: datetime
	category: str
	is_active: bool 