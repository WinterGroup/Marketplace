from sqlalchemy import Column, String, Integer
from db.session import Base

class UserTable(Base):
	__tablename__ = "users"
	id = Column(Integer, primary_key=True)
	username = Column(String, unique=True, nullable=False)
	email = Column(String, unique=True, nullable=False)
	password = Column(String, nullable=False)

	def __repr__(self):
		return {'id': self.id, 'username': self.username, 'email': self.email, 'password': self.password}