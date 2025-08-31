from db.session import session, connection
from tables.user_table import User
from models.user_model import UserModel 
from typing import Optional
from argon2 import PasswordHasher
from dotenv import load_dotenv
from sqlalchemy import select
import sqlalchemy
import os
from argon2.exceptions import VerifyMismatchError

class UserRepository:
	def __init__(self, session) -> None:
		self.session = session
		self.ph = PasswordHasher()

	@connection
	async def create(self, user: UserModel) -> Optional[UserModel] | bool:
		try:
			user.password = self.ph.hash(user.password)
			self.session.add(User(**user.dict()))
			await self.session.commit()
			return user
		except sqlalchemy.exc.IntegrityError:
			return False
			
	@connection
	async def deleteByUsername(self, username: str) -> bool:
		found = await self.session.execute(select(User).where(User.username == username)).scalar_one_or_none()
		if found:
			self.session.delete(found)
			await self.session.commit()
			return True
		return False

	@connection
	async def deleteById(self, id: int) -> bool:
		found = await self.session.get(User, id)
		if found:
			self.session.delete(found)
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
		result = await self.session.execute(select(User).where(User.username==username))
		user = result.scalar_one_or_none()
		if user:
			try:
				if self.ph.verify(user.password, password):
					return [True, user.account_status]
			except VerifyMismatchError:
				return False
		return None
	
def getUserRepository() -> UserRepository:
	return UserRepository(session)
