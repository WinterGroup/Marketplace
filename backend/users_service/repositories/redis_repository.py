from typing import Optional, Union
from pydantic import BaseModel
import pickle
from redis.asyncio import Redis


class RedisRepository:
    def __init__(self):
        self.r = Redis(
            host="redis",
            port=6379,
        )

    async def setItem(self, key: Union[str, int], item: BaseModel) -> BaseModel:
        pickled = pickle.dumps(item)
        await self.r.set(key, pickled, ex=604800)  # 7 дней TTL
        return item

    async def getItem(self, key: Union[str, int]) -> Optional[BaseModel]:
        item = await self.r.get(key)
        return pickle.loads(item) if item else None

    async def delete(self, key: Union[str, int]) -> None:
        await self.r.delete(key)


def getRedisRepository() -> RedisRepository:
    return RedisRepository()
