FROM python:3.12.3-slim
WORKDIR /app
COPY requirements.txt .
COPY main.py .
COPY . .
RUN pip install --no-cache-dir -r requirements.txt
CMD ["python3", "main.py"]
