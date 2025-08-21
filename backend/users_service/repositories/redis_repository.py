from pydantic import BaseModel
from typing import Optional
import pickle
import redis



class RedisRepository():
	def __init__(self):
		self.r = redis.Redis(
			host="redis",
			port=6379,
		)
	
	def setItem(self, key: Optional[str] | int, item: BaseModel) -> BaseModel:
		pickled = pickle.dumps(item)
		self.r.set(key, pickled)
		return item

	def getItem(self, key: Optional[str] | int) -> Optional[BaseModel] | None:
		item = self.r.get(key)
		return pickle.loads(item) if item else None
	
	def delete(self, key: Optional[str] | int):
		self.r.delete(key)


def getRedisRepository() -> RedisRepository:
    return RedisRepository()
