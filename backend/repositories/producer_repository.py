from db.producer import producer, producerExitDecorator
from core.config import KAFKA
from kafka import KafkaProducer
from pydantic import BaseModel
class ProducerRepository(object):
	def __init__(self, producer: KafkaProducer) -> None:
		self.producer = producer

	@producerExitDecorator
	def send(self, model: BaseModel) -> BaseModel:
		self.producer.send(
			topic=KAFKA.TRANSACTION_TOPIC, 
			value=bytes(model).encode()
		)
		return model

def GetProducerRepository() -> ProducerRepository:
	return ProducerRepository(producer)
