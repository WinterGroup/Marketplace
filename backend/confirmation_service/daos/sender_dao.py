from repositories.sender_repository import SenderRepository

class SenderDAO():
	def __init__(self, From, To, Subject, Content) -> None:
		self.repository = SenderRepository(From, To, Subject, Content)

	async def send(self) -> None:
		await self.repository.send()