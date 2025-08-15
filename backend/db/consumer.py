from kafka import KafkaConsumer
from core.config import KAFKA

consumer = KafkaConsumer(
	KAFKA.TRANSACTION_TOPIC,
	bootstrap_server=KAFKA.HOST
)
