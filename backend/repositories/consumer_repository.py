from kafka import KafkaConsumer
from typing import List
from pydantic import BaseModel

class ConsumerRepository():
	def __init__(self) -> None:
		self.consumer = KafkaConsumer(
			KAFKA.TRANSACTION_TOPIC,
			bootstrap_server=KAFKA.HOST
		)

	def getMessages(self) -> List:
		messages = [msg for msg in self.consumer]
		return messages

def getConsumerRepository() -> ConsumerRepository:
	return ConsumerRepository()

