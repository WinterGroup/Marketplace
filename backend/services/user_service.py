from repositories.user_repository import UserRepository, getUserRepository
from schemas.user import User
from schemas.user_model import UserModel
from typing import Optional
from repositories.redis_repository import RedisRepository, getRedisRepository

class UserService:
	def __init__(self, repository: UserRepository, redis_repository: RedisRepository) -> None:
		self.repository = repository
		self.redis_client = redis_repository
		
	def create(self, user: UserModel) -> Optional[UserModel] | bool:
		return self.repository.create(user)

	def delete(self, username: str) -> bool:
		self.redis_client.delete(username)
		return self.repository.delete(username)

	def getByUsername(self, username: str) -> Optional[UserModel]:
		user = self.redis_client.getItem(username)
		if user:
			return user
		user = self.repository.getByUsername(username)
		if user:
			self.redis_client.setItem(username, user)
			return user
		return None


	def getById(self, id: int) -> Optional[UserModel]:
		user = self.redis_client.getItem(id)
		if user:
			return user
		user = self.repository.getById(id)
		if user:
			self.redis_client.setItem(id, user)
			return user
		return None

	def validatePassword(self, username: str, password: str) -> Optional[bool]:
		return self.repository.validatePassword(username, password)
		
def getUserService() -> UserService:
	return UserService(getUserRepository(), getRedisRepository())
