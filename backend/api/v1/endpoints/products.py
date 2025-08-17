from fastapi import APIRouter, Depends
from services.product_service import getProductService

router = APIRouter(prefix="/products")

@router.get("")
def getAll(service: getProductService = Depends()):
	return service.getAll()

@router.get("/{id}")
def getById(id: int, service: getProductService = Depends()):
	return service.getById(id)

@router.delete("/{id}")
def deleteByid(id:int, service: getProductService = Depends()):
	return service.delete(id)