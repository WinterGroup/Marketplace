from repositories.product_repository import ProductRepository
from schemas.product_model import ProductModel
from typing import Optional, List

class ProductService():
	def __init__(self, repository: ProductRepository) -> None:
		self.repository = repository

	def create(self, product: ProductModel) -> Optional[ProductModel] | bool:
		return self.repository.create(product)

	def delete(self, id: int) -> Optional[bool]:
		return self.repository.delete(id)

	def searchByUsername(self, username: str) -> List[ProductModel]:
		return self.repository.searchByUsername(username)
		