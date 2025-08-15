from repositories.consumer_repository import ConsumerRepository, getConsumerRepository
from pydantic import BaseModel
from typing import List

class ConsumerService():
	def __init__(self, repository: ConsumerRepository) -> None:
		self.repository = repository

	def getMessages(self) -> List:
		return self.repository.getMessages()

def getConsumerService() -> ConsumerService:
	return ConsumerService(getConsumerRepository)