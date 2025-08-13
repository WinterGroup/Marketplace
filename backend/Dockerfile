FROM python:3.12.3-slim

WORKDIR /backend

COPY . /backend
COPY requirements.txt /backend
RUN pip3 install --no-cache-dir -r requirements.txt
CMD ["python3", "main.py"]
