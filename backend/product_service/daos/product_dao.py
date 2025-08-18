from repositories.product_repository import ProductRepository, getProductRepository
from models.product_model import ProductModel
from typing import Optional, List

class ProductDAO():
	def __init__(self, repository: ProductRepository) -> None:
		self.repository = repository

	def create(self, product: ProductModel) -> Optional[ProductModel] | bool:
		return self.repository.create(product)

	def delete(self, id: int) -> Optional[bool]:
		return self.repository.delete(id)

	def searchByUsername(self, username: str) -> List[ProductModel]:
		return self.repository.searchByUsername(username)
	
	def getById(self, id: int) -> Optional[ProductModel]:
		return self.repository.getById(id)

	def getAll(self) -> List[ProductModel]:
		return self.repository.getAll()

def getProductDAO() -> ProductDAO:
	return ProductDAO(getProductRepository())
