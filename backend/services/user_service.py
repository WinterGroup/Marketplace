from repositories.user_repository import UserRepository, getUserRepository
from schemas.user import User
from schemas.user_model import UserModel
from typing import Optional

class UserService:
	def __init__(self, repository: UserRepository) -> None:
		self.repository = repository

	def create(self, user: UserModel) -> Optional[UserModel] | bool:
		return self.repository.create(user)

	def delete(self, username: str) -> bool:
		return self.repository.delete(username)

	def getByUsername(self, username: str) -> Optional[UserModel]:
		return self.repository.getByUsername(username)

	def getById(self, id: int) -> Optional[UserModel]:
		return self.repository.getById(id) 

def getUserService() -> UserService:
	return UserService(getUserRepository())