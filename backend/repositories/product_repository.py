from db.session import session, connection
from schemas.product import ProductTable
from schemas.product_model import ProductModel
from typing import Optional, List
import sqlalchemy

class ProductRepository():
	def __init__(self, session):
		self.session = session

	@connection
	def create(self, product: ProductModel) -> Optional[ProductModel] | bool:
		try:
			self.session.add(UserTable(**product.dict()))
			self.session.commit()
			return product
		except sqlalchemy.exc.IntegrityError:
			return False

	@connection
	def delete(self, id: int) -> Optional[bool]:
		product = self.session.query(ProductTable).filter_by(id=id).first()
		if product:
			self.session.delete(product)
			self.session.commit()
			return True
		return None

	@connection
	def searchByUsername(self, username: str) -> List[ProductModel]:
		return self.session.query(ProductTable).filter_by(username=username).all()

	@connection
	def getById(self, id: int) -> Optional[ProductModel]:
		product = self.session.query(ProductTable).filter_by(id=id).first()
		return product if product else None

	@connection
	def getAll(self) -> List[ProductModel]:
		return self.session.query(ProductTable).all()

def getProductRepository() -> ProductRepository:
	return ProductRepository(session)