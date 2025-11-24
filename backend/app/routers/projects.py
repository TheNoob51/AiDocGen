from fastapi import APIRouter, HTTPException, Depends
from typing import List
from ..models import Project, ProjectCreate, DocumentConfig
from ..services.firebase_service import get_db
from datetime import datetime
import uuid

router = APIRouter(
    prefix="/projects",
    tags=["projects"],
)

@router.post("/", response_model=Project)
async def create_project(project: ProjectCreate):
    print(f"Received create_project request: {project}")
    db = get_db()
    if not db:
        print("Database unavailable")
        raise HTTPException(status_code=503, detail="Database unavailable")
    
    project_id = str(uuid.uuid4())
    now = datetime.utcnow()
    
    new_project = Project(
        id=project_id,
        user_id=project.user_id,
        title=project.title,
        description=project.description,
        document_type=project.document_type,
        created_at=now,
        updated_at=now,
        status="draft",
        content={}
    )
    
    # Store in Firestore
    try:
        print(f"Attempting to save project {project_id} to Firestore")
        doc_ref = db.collection("projects").document(project_id)
        doc_ref.set(new_project.dict())
        print("Project saved successfully")
    except Exception as e:
        print(f"Error saving to Firestore: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    
    return new_project

@router.get("/", response_model=List[Project])
async def list_projects(user_id: str):
    db = get_db()
    if not db:
        raise HTTPException(status_code=503, detail="Database unavailable")
    
    projects_ref = db.collection("projects")
    query = projects_ref.where("user_id", "==", user_id).stream()
    
    projects = []
    for doc in query:
        projects.append(Project(**doc.to_dict()))
        
    return projects

@router.get("/{project_id}", response_model=Project)
async def get_project(project_id: str):
    db = get_db()
    if not db:
        raise HTTPException(status_code=503, detail="Database unavailable")
    
    doc_ref = db.collection("projects").document(project_id)
    doc = doc_ref.get()
    
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Project not found")
        
    return Project(**doc.to_dict())

@router.put("/{project_id}/config")
async def update_project_config(project_id: str, config: DocumentConfig):
    db = get_db()
    if not db:
        raise HTTPException(status_code=503, detail="Database unavailable")
    
    doc_ref = db.collection("projects").document(project_id)
    doc = doc_ref.get()
    
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Update project with configuration
    # We might store this in a 'configuration' field or merge with content
    doc_ref.update({
        "configuration": config.dict(),
        "updated_at": datetime.utcnow()
    })
    
    return {"message": "Configuration updated"}
