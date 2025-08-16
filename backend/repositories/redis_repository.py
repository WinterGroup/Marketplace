from core.config import REDIS
from pydantic import BaseModel
from typing import Optional

import redis
import pickle # i am pickle rick :)

class RedisRepository:
	def __init__() -> None:
		self.client = redis.Redis(
			host=REDIS.HOST,
			port=REDIS.PORT
		)

	def setItem(self, key, item: BaseModel) -> BaseModel:
		pickled_item = pickle.dumps(item)
		self.client.set(key, pickled_item)
		return item

	def getItem(self, key) -> Optional[BaseModel]:
		found = self.client.get(key)
		if found:
			return pickle.loads(found)
		return None

	def delete(self, key):
		self.client.delete(key)

def getRedisRepository() -> RedisRepository:
	return RedisRepository()