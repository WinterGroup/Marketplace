from fastapi import APIRouter, Depends
from daos.product_dao import getProductDAO
from models.product_model import ProductModel
from typing import Optional, List
from routers.dependencies.authentication import getCurrentUser

router = APIRouter(prefix="/products")

@router.get("/")
async def getAll(service: getProductDAO = Depends()) -> List[ProductModel]:
	return await service.getAll()

@router.get("/search")
async def search(
		id: int = 0, 
		username: str = "", 
		service: getProductDAO = Depends()
	) -> Optional[ProductModel] | List:

	if username != "":
		return await service.searchByUsername(username)
	return await service.getById(id)

@router.post("/create")
async def create(
		name: str,
		price: int,
		username: getCurrentUser = Depends(),
		service: getProductDAO = Depends()
	) -> ProductModel:

	return await service.create(ProductModel(username=username['username'], price=price, name=name))