from fastapi import APIRouter, Depends
from daos.product_dao import getProductDAO

router = APIRouter(prefix="/products")

@router.get("")
def getAll(service: getProductDAO = Depends()):
	return service.getAll()

@router.get("/{id}")
def getById(id: int, service: getProductDAO = Depends()):
	return service.getById(id)

@router.delete("/{id}")
def deleteByid(id:int, service: getProductDAO = Depends()):
	return service.delete(id)
