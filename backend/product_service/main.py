from fastapi import FastAPI
from routers.product_router import router as product_router
from db.session import engine, Base, session
import uvicorn

def app() -> FastAPI:
    app = FastAPI(root_path="/api")
    app.include_router(product_router)
    
    @app.on_event("startup")
    def startup():
        Base.metadata.create_all(engine)

    @app.on_event("shutdown")
    def shutdown():
        session.close()
        
    return app

if __name__=="__main__":
    uvicorn.run("main:app", host="localhost", port=8002)
