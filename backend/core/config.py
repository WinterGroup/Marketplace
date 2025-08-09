class DATABASE:
	USERNAME = "postgres"
	PASSWORD = "postgres"
	HOST = "localhost"
	PORT = 5432
	NAME = "test_database"

	@classmethod
	def ADDRESS(self):
		#return f"postgresql+psycopg2://{self.USERNAME}:{self.PASSWORD}@{self.HOST}:{self.PORT}/{self.NAME}"
		return f"sqlite:///db/lite_database.db"
