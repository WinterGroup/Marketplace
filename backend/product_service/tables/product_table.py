from sqlalchemy import Column, String, Integer, TIMESTAMP, Boolean
from db.session import Base
from sqlalchemy.sql import func

class ProductTable(Base):
	__tablename__ = "products"

	id = Column(Integer, primary_key=True)
	username = Column(String, nullable=False)
	description = Column(String, nullable=False)
	price = Column(Integer, nullable=False)
	created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
	category = Column(String, nullable=False)
	is_active = Column(Boolean, nullable=False, default=True)
	
	def __repr__(self):
		return {
			'id': self.id,
			'user': self.username, 
			'description': self.description,
			'price': self.price,
			'created_at': self.created_at,
			'is_active': self.is_active,
			'category': self.category
		}
