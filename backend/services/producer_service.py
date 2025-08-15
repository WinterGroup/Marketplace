from repositories.producer_repository import ProducerRepository, getProducerRepository
from pydantic import BaseModel

class ProducerService():
	def __init__(self, repository: ProducerRepository):
		self.repository = repository

	def send(self, model: BaseModel) -> BaseModel:
		return self.repository.send(model)

def getProducerService() -> ProducerService:
	return ProducerService(getProducerRepository())