from sqlalchemy import Column, String, Integer
from db.session import Base

class ProductTable(Base):
	__tablename__ = "products"

	id = Column(Integer, primary_key=True)
	username = Column(String, nullable=False)
	name = Column(String, nullable=False)
	price = Column(Integer, nullable=False)

	def __repr__(self):
		return {'id': self.id, 'user': self.username, 'product_name': self.name, 'price': self.price}