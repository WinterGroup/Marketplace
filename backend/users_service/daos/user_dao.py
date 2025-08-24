from repositories.redis_repository import RedisRepository, getRedisRepository
from repositories.user_repository import UserRepository, getUserRepository
from tables.user_table import User
from models.user_model import UserModel
from typing import Optional
import redis
import pickle

#next time i will make code look better

class UserDAO:
	def __init__(self, repository: UserRepository, redis_repository: RedisRepository) -> None:
		self.repository = repository
		self.redis_client = redis_repository

	async def create(self, user: UserModel) -> Optional[UserModel] | bool:
		return await self.repository.create(user)

	async def deleteByUsername(self, username: str) -> bool:
		await self.redis_client.delete(username)
		return await self.repository.delete(username)

	async def deleteById(self, id: int) -> bool:
		await self.redis_client.delete(f"user {id}")
		return await self.repository.deleteById(id)

	async def getByUsername(self, username: str) -> Optional[UserModel]:
		user = await self.redis_client.getItem(username)
		if user:
			return user
		user = await self.repository.getByUsername(username)
		if user:
			await self.redis_client.setItem(username, user)
			return user
		return None


	async def getById(self, id: int) -> Optional[UserModel]:
		user = await self.redis_client.getItem(f"user {id}")
		if user:
			return user
		user = await self.repository.getById(id)
		if user:
			self.redis_client.setItem(f"user {id}", user)
			return user
		return None

	async def validatePassword(self, username: str, password: str) -> Optional[list]:
		return await self.repository.validatePassword(username, password)
		
def getUserDAO() -> UserDAO:
	return UserDAO(getUserRepository(), getRedisRepository())
