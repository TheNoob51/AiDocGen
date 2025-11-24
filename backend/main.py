from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import projects, generate, export #, auth # Uncomment when created

app = FastAPI(title="AI Document Authoring API")

# CORS Configuration
origins = [
    "http://localhost:5173",  # Vite default port
    "http://localhost:5174",  # Current frontend port
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Welcome to the AI Document Authoring Platform API"}

# app.include_router(auth.router)
app.include_router(projects.router)
app.include_router(generate.router)
app.include_router(export.router)
