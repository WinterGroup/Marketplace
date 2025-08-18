from pydantic import BaseModel
from typing import Optional
import pickle
import redis



class RedisRepository():
	def __init__(self):
		self.r = redis.Redis(
			host="localhost",
			port=6379
		)
	
	def set(self, key: Optional[str] | int, item: BaseModel) -> BaseModel:
		pickled = pickle.dumps(item)
		r.set(key, pickled)
		return pickled

	def get(self, key: Optional[str] | int) -> Optional[BaseModel] | None:
		return r.get(key)
	
	def delete(self, key: Optional[str] | int):
		r.delete(key)


def getRedisRepository() -> RedisRepository:
    return RedisRepository()
