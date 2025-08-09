from db.session import session, connection
from schemas.user import User
from schemas.user_model import UserModel
from typing import Optional
import sqlalchemy
class UserRepository:
	def __init__(self, session) -> None:
		self.session = session

	@connection
	def create(self, user: UserModel) -> Optional[UserModel] | bool:
		try:
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

		
	
def getUserRepository() -> UserRepository:
	return UserRepository(session)