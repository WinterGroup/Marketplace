from db.session import session, connection
from tables.product_table import ProductTable
from models.product_model import ProductModel
from typing import Optional, List
from sqlalchemy import select
import sqlalchemy

class ProductRepository():
	def __init__(self, session):
		self.session = session

	@connection
	async def create(self, product: ProductModel) -> Optional[ProductModel] | bool:
		try:
			await self.session.add(ProductTable(**product.dict()))
			await self.session.commit()
			return product
		except sqlalchemy.exc.IntegrityError:
			return False

	@connection
	async def delete(self, id: int) -> Optional[bool]:
		product = await self.session.get(ProductTable, id)
		if product:
			await self.session.delete(product)
			await self.session.commit()
			return True
		return None

	@connection
	async def searchByUsername(self, username: str) -> List[ProductModel]:
		products = await self.session.execute(select(ProductTable).where(ProductTable.username == username))
		return products.scalars().all()

	@connection
	async def getById(self, id: int) -> Optional[ProductModel]:
		product = await self.session.get(ProductTable, id)
		return product if product else None

	@connection
	async def getAll(self) -> List[ProductModel]:
		result = await self.session.execute(select(ProductTable))
		return result.scalars().all()
def getProductRepository() -> ProductRepository:
	return ProductRepository(session)
