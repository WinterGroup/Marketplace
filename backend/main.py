from fastapi import FastAPI
import uvicorn

def app() -> FastAPI:
	application = FastAPI(root_path="/api")

	return application

if __name__ == "__main__":
	uvicorn.run("main:app", host="localhost", port=8080, reload=True)