from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import auth, exercises, favorites, plans, progress, users

Base.metadata.create_all(bind=engine)

app = FastAPI(title="FitTrack Pro API", version="1.0.0", redirect_slashes=False)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(exercises.router)
app.include_router(favorites.router)
app.include_router(plans.router)
app.include_router(progress.router)
app.include_router(users.router)

@app.get("/")
def root():
    return {"message": "FitTrack Pro API is running 🏋️"}

@app.get("/health")
def health():
    return {"status": "ok"}