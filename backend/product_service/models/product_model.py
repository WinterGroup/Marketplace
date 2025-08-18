from pydantic import BaseModel

class ProductModel(BaseModel):
	username: str
	name: str
	price: int
