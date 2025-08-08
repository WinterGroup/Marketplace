FROM python:3.12.3-slim

WORKDIR /app
COPY . .
RUN pip install --no-cahce-dir -r requirements.txt
EXPOSE 8080
CMD ["python3", "main.py"] 

