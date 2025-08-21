from fastapi import APIRouter, Depends
from daos.product_dao import getProductDAO

router = APIRouter(prefix="/products")

@router.get("/")
def getAll(service: getProductDAO = Depends()):
	return service.getAll()

@router.get("/search")
def getById(id: int, service: getProductDAO = Depends()):
	return service.getById(id)

@router.delete("/delete")
def deleteByid(id:int, service: getProductDAO = Depends()):
	return service.delete(id)

@router.get("/test")
def test():
	return {"ok"}