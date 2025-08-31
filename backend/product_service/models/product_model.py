from pydantic import BaseModel
from datetime import datetime


class ProductModel(BaseModel):
	id: int
	username: str
	description: str
	price: int
	created_at: datetime
	category: str
	is_active: bool