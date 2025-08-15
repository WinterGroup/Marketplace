from kafka import KafkaConsumer
from db.consumer import consumer
from typing import List
from pydantic import BaseModel

class ConsumerRepository():
	def __init__(self, consumer: KafkaConsumer) -> None:
		self.consumer = consumer

	def getMessages(self) -> List:
		messages = [msg for msg in self.consumer]
		return messages

def getConsumerRepository() -> ConsumerRepository:
	return ConsumerRepository(consumer)

