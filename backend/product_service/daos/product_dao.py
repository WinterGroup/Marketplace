from repositories.product_repository import ProductRepository, getProductRepository
from models.product_model import ProductModel
from typing import Optional, List

class ProductDAO():
	def __init__(self, repository: ProductRepository) -> None:
		self.repository = repository

	async def create(self, product: ProductModel) -> Optional[ProductModel] | bool:
		return await self.repository.create(product)

	async def delete(self, id: int) -> Optional[bool]:
		return await self.repository.delete(id)

	async def searchByUsername(self, username: str) -> List[ProductModel]:
		return await self.repository.searchByUsername(username)
	
	async def getById(self, id: int) -> Optional[ProductModel]:
		return await self.repository.getById(id)

	async def getAll(self) -> List[ProductModel]:
		return await self.repository.getAll()

def getProductDAO() -> ProductDAO:
	return ProductDAO(getProductRepository())
