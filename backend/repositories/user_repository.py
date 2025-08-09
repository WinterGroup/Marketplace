from database.session import session, connection
from schemas.user_model import UserModel
from schemas.user_table import UserTable
from typing import Optional

class UserRepository:
	def __init__(self, session) -> None:
		self.session = session

	@connection
	def create(self, user: UserModel) -> Optional[UserModel] | bool:
		found = self.session.query(UserTable).filter_by(username=username).first()
		if found:
			return False
		self.session.add(user)
		self.session.commit()
		return user

	@connection
	def delete(self, username: str) -> bool:
		found = self.session.query(UserTable).filter_by(username=username).first()
		if found:
			self.session.delete(found)
			self.session.commit()
			return True
		return False

	@connection
	def getByUsername(self, username: str) -> Optional[UserModel]:
		return self.session.query(UserTable).filter_by(username=username).first()

	@connection
	def getById(self, id: int) -> Optional[UserModel]:
		return self.session.query(UserTable).filter_by(id=id).first()

		
	
def GetUserRepository() -> UserRepository:
	return UserRepository(session)