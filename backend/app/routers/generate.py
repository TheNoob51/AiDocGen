from fastapi import APIRouter, HTTPException, BackgroundTasks
from ..services.firebase_service import get_db
from ..services.llm_service import generate_section_content, generate_slide_content, refine_content, generate_outline_recommendations
from ..models import Project
from datetime import datetime

router = APIRouter(
    prefix="/projects",
    tags=["generate"],
)

import asyncio

async def generate_project_content_task(project_id: str):
    db = get_db()
    if not db:
        return
    
    doc_ref = db.collection("projects").document(project_id)
    doc = doc_ref.get()
    if not doc.exists:
        return
    
    project_data = doc.to_dict()
    config = project_data.get("configuration", {})
    topic = project_data.get("title") # Use title as topic if not in config
    if config.get("topic"):
        topic = config.get("topic")
        
    generated_content = {}
    
    if project_data.get("document_type") == "docx":
        outline = config.get("outline", [])
        for section in outline:
            content = await generate_section_content(topic, section)
            generated_content[section] = content
            await asyncio.sleep(2) # Rate limit protection
            
    elif project_data.get("document_type") == "pptx":
        slides = config.get("slides", [])
        for i, slide in enumerate(slides):
            title = slide.get("title")
            content = await generate_slide_content(topic, title)
            generated_content[f"slide_{i}"] = {
                "title": title,
                "content": content
            }
            await asyncio.sleep(2) # Rate limit protection
            
    # Update project with generated content and status
    doc_ref.update({
        "content": generated_content,
        "status": "completed", # or "refined"
        "updated_at": datetime.utcnow()
    })

@router.post("/{project_id}/generate")
async def generate_content_endpoint(project_id: str, background_tasks: BackgroundTasks):
    db = get_db()
    if not db:
        raise HTTPException(status_code=503, detail="Database unavailable")
    
    doc_ref = db.collection("projects").document(project_id)
    doc = doc_ref.get()
    
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Project not found")
        
    # Set status to generating
    doc_ref.update({"status": "generating"})
    
    # Run generation in background
    background_tasks.add_task(generate_project_content_task, project_id)
    
    return {"message": "Generation started"}

@router.post("/{project_id}/refine")
async def refine_content_endpoint(project_id: str, section_key: str, instruction: str):
    db = get_db()
    if not db:
        raise HTTPException(status_code=503, detail="Database unavailable")
    
    doc_ref = db.collection("projects").document(project_id)
    doc = doc_ref.get()
    
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Project not found")
        
    project_data = doc.to_dict()
    content = project_data.get("content", {})
    
    current_text = ""
    if project_data.get("document_type") == "docx":
        current_text = content.get(section_key, "")
    elif project_data.get("document_type") == "pptx":
        # For PPTX, section_key might be "slide_0"
        # We might need to refine bullets or notes. For simplicity, let's assume we refine bullets text block
        slide_data = content.get(section_key, {})
        current_text = "\n".join(slide_data.get("content", {}).get("bullets", []))
    
    refined_text = await refine_content(current_text, instruction)
    
    # Create history item
    history_item = {
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "description": f"Refined {section_key} with instruction: {instruction}",
        "previous_content": project_data.get("content", {})
    }
    
    # Update content
    if project_data.get("document_type") == "docx":
        content[section_key] = refined_text
    elif project_data.get("document_type") == "pptx":
        # Parse back to bullets if possible, or just store as text list
        bullets = [line.strip().lstrip('-* ') for line in refined_text.split('\n') if line.strip()]
        content[section_key]["content"]["bullets"] = bullets
        
    # Get existing history or initialize
    history = project_data.get("history") or []
    history.append(history_item)

    doc_ref.update({
        "content": content,
        "history": history,
        "updated_at": datetime.utcnow()
    })
    
    return {"refined_content": refined_text}

from pydantic import BaseModel

class OutlineRecommendationRequest(BaseModel):
    current_outline: list[str] = []

@router.post("/{project_id}/recommend-outline")
async def recommend_outline_endpoint(project_id: str, request: OutlineRecommendationRequest):
    db = get_db()
    if not db:
        raise HTTPException(status_code=503, detail="Database unavailable")
    
    doc_ref = db.collection("projects").document(project_id)
    doc = doc_ref.get()
    
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Project not found")
        
    project_data = doc.to_dict()
    topic = project_data.get("title")
    
    # If topic is in config, use that
    config = project_data.get("configuration") or {}
    if config.get("topic"):
        topic = config.get("topic")
        
    recommendations = await generate_outline_recommendations(topic, request.current_outline)
    
    return {"recommendations": recommendations}
