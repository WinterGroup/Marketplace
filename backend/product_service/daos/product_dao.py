from repositories.product_repository import ProductRepository, getProductRepository
from models.product_model import ProductModel
from typing import Optional, List
from repositories.redis_repository import getRedisRepository, RedisRepository

class ProductDAO():
	def __init__(self, repository: ProductRepository, redis_repository: RedisRepository) -> None:
		self.repository = repository
		self.redisClient = redis_repository

	async def create(self, product: ProductModel) -> Optional[ProductModel] | bool:
		return await self.repository.create(product)

	async def delete(self, id: int) -> Optional[bool]:
		await self.redisClient.delete(f"product {id}")
		return await self.repository.delete(id)

	async def searchByUsername(self, username: str) -> List[ProductModel]:
		return await self.repository.searchByUsername(username)
	
	async def getById(self, id: int) -> Optional[ProductModel]:
		product = await self.redisClient.getItem(f"product {id}")
		if product:
			return product
		product = await self.repository.getById(id)
		if product:
			await redisClient.setItem(f"product {id}", user)
			return product
		return None 

	async def getAll(self) -> List[ProductModel]:
		return await self.repository.getAll()

def getProductDAO() -> ProductDAO:
	return ProductDAO(getProductRepository(), getRedisRepository())
