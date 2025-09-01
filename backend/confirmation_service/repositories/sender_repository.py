from email.message import EmailMessage
import aiosmtplib
import ssl
class SenderRepository:
	def __init__(
			self,
			From: str,
			To: str, 
			Subject: str,
			Content
		) -> None:

		self.To = To
		self.message = EmailMessage()
		self.message['From'] = From
		self.message['To'] = To
		self.message['Subject'] = Subject
		self.message.set_content(Content)



	async def send(self) -> None:
		context = ssl.create_default_context()
		
		async with aiosmtplib.SMTP(
				hostname=os.environ.get("MAIL_HOSTNAME"), 
				port=465, 
				use_tls=True,	
				tls_context=context
			) as smtp:
			await smtp.login(os.environ.get("MAIL"), os.environ.get("PASSWORD"))
			await smtp.send_msg(self.message)
			await smtp.quit()