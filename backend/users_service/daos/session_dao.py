from models.refresh_model import RefreshModel
from repositories.redis_repository import RedisRepository, getRedisRepository
from typing import Optional

class SessionDAO():
	def __init__(self, redisClient: RedisRepository) -> None:
		self.redisClient = redisClient

	async def create(self, model: RefreshModel) -> RefreshModel:
		await self.redisClient.setItem(model.hash, model)
		return model.hash

	async def delete(self, hash: str) -> None:
		await self.redisClient.delete(hash)

	async def getByHash(self, hash: str) -> Optional[RefreshModel]:
		return await self.redisClient.getItem(hash)

def getSessionDAO() -> SessionDAO:
	return SessionDAO(getRedisRepository())