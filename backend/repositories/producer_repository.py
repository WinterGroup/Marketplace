from db.producer import producerExitDecorator
from core.config import KAFKA
from kafka import KafkaProducer
from pydantic import BaseModel

class ProducerRepository(object):
	def __init__(self) -> None:
		self.producer = KafkaProducer(
			bootstrap_servers=KAFKA.HOST,
			value_serializer=lambda v: json.dumps(v).encode("utf-8")
		)

	@producerExitDecorator
	def send(self, model: BaseModel) -> BaseModel:
		self.producer.send(
			topic=KAFKA.TRANSACTION_TOPIC, 
			value=bytes(model).encode()
		)
		return model

	@producerExitDecorator
	def sendString(self, string: str) -> str:
		self.producer.send(
			topic=KAFKA.MESSAGE_TOPIC,
			value=bytes(string).encode()
		)
		return string

def GetProducerRepository() -> ProducerRepository:
	return ProducerRepository(producer)
