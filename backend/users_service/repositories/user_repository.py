from db.session import session, connection
from tables.user_table import User
from models.user_model import UserModel 
from typing import Optional
from cryptography.fernet import Fernet
from dotenv import load_dotenv
from sqlalchemy import select
import sqlalchemy
import os

class UserRepository:
	def __init__(self, session) -> None:
		self.session = session
		self.f = Fernet(os.environ.get("SECRET_KEY").encode())

	@connection
	async def create(self, user: UserModel) -> Optional[UserModel] | bool:
		try:
			user.password = self.f.encrypt(user.password.encode())
			await self.session.add(User(**user.dict()))
			await self.session.commit()
			return user
		except sqlalchemy.exc.IntegrityError:
			return False
			
	@connection
	async def delete(self, username: str) -> bool:
		found = await session.execute(select(User).where(User.username == username)).scalar_one_or_none()
		if found:
			await self.session.delete(found)
			await self.session.commit()
			return True
		return False

	@connection
	async def getByUsername(self, username: str) -> Optional[UserModel]:
		result = await self.session.execute(select(User).where(User.username == username))
		return result.scalar_one_or_none()

	@connection
	async def getById(self, id: int) -> Optional[UserModel]:
		return await self.session.get(User, id)

	@connection
	async def validatePassword(self, username: str, password: str) -> Optional[list]:
		result = await self.session(select(User).where(User.username==username))
		user = result.scallars_one_or_none()
		if user:
			if self.f.decrypt(user.password).decode('utf-8') == password:
				return [True, user.account_status]
			return False
		return None
	
def getUserRepository() -> UserRepository:
	return UserRepository(session)
