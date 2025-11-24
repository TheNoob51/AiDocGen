from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from ..services.firebase_service import get_db
from ..services.document_service import create_docx, create_pptx
import io

router = APIRouter(
    prefix="/projects",
    tags=["export"],
)

@router.get("/{project_id}/export")
async def export_project(project_id: str):
    db = get_db()
    if not db:
        raise HTTPException(status_code=503, detail="Database unavailable")
    
    doc_ref = db.collection("projects").document(project_id)
    doc = doc_ref.get()
    
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Project not found")
        
    project_data = doc.to_dict()
    doc_type = project_data.get("document_type")
    title = project_data.get("title", "document").replace(" ", "_")
    
    if doc_type == "docx":
        file_stream = create_docx(project_data)
        media_type = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        filename = f"{title}.docx"
    elif doc_type == "pptx":
        file_stream = create_pptx(project_data)
        media_type = "application/vnd.openxmlformats-officedocument.presentationml.presentation"
        filename = f"{title}.pptx"
    else:
        raise HTTPException(status_code=400, detail="Unsupported document type")
        
    return StreamingResponse(
        file_stream, 
        media_type=media_type, 
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )
