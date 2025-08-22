from fastapi import APIRouter, Depends
from daos.product_dao import getProductDAO
from models.product_model import ProductModel
from typing import Optional, List

router = APIRouter(prefix="/products")

@router.get("/")
def getAll(service: getProductDAO = Depends()) -> List[ProductModel]:
	return service.getAll()

@router.get("/search")
def search(
		id: int = 0, 
		username: str = "", 
		service: getProductDAO = Depends()
	) -> Optional[ProductModel] | List:

	product = service.getById(id)
	if username != "":
		product = service.searchByUsername(username)
	return product