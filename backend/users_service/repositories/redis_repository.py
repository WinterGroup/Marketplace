from pydantic import BaseModel
from typing import Optional
import pickle
from redis.asyncio import Redis

class RedisRepository():
	def __init__(self):
		self.r = Redis(
			host="redis",
			port=6379,
		)
	
	async def setItem(self, key: Optional[str] | int, item: BaseModel) -> BaseModel:
		pickled = pickle.dumps(item)
		await self.r.set(key, pickled)
		return item

	async def getItem(self, key: Optional[str] | int) -> Optional[BaseModel] | None:
		item = await self.r.get(key)
		return pickle.loads(item) if item else None
	
	async def delete(self, key: Optional[str] | int):
		await self.r.delete(key)


def getRedisRepository() -> RedisRepository:
    return RedisRepository()
