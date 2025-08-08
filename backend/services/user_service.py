from repositories.user_repository import UserRepository

class UserService:
	def __init__(self, repository: UserRepository) -> None:
		self.repository = repository