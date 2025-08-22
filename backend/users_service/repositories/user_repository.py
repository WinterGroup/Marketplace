from db.session import session, connection
from tables.user_table import User
from models.user_model import UserModel 
from typing import Optional
from cryptography.fernet import Fernet
from dotenv import load_dotenv
import sqlalchemy
import os

class UserRepository:
	def __init__(self, session) -> None:
		self.session = session
		self.f = Fernet(os.environ.get("SECRET_KEY").encode())

	@connection
	def create(self, user: UserModel) -> Optional[UserModel] | bool:
		try:
			user.password = self.f.encrypt(user.password.encode())
			self.session.add(User(**user.dict()))
			self.session.commit()
			return user
		except sqlalchemy.exc.IntegrityError:
			return False
			
	@connection
	def delete(self, username: str) -> bool:
		found = self.session.query(User).filter_by(username=username).first()
		if found:
			self.session.delete(found)
			self.session.commit()
			return True
		return False

	@connection
	def getByUsername(self, username: str) -> Optional[UserModel]:
		return self.session.query(User).filter_by(username=username).first()

	@connection
	def getById(self, id: int) -> Optional[UserModel]:
		return self.session.query(User).filter_by(id=id).first()

	@connection
	def validatePassword(self, username: str, password: str) -> Optional[list]:
		user = self.session.query(User).filter_by(username=username).first()
		if user:
			if self.f.decrypt(user.password).decode('utf-8') == password:
				return [True, user.account_status]
			return False
		return None
	
def getUserRepository() -> UserRepository:
	return UserRepository(session)
