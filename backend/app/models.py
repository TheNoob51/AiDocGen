from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

class ProjectBase(BaseModel):
    title: str
    description: Optional[str] = None
    document_type: str  # 'docx' or 'pptx'

class ProjectCreate(ProjectBase):
    user_id: str

class Project(ProjectBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: datetime
    content: Optional[Dict[str, Any]] = None # Store generated content structure here
    status: str = "draft" # draft, generating, completed
    configuration: Optional[Dict[str, Any]] = None # Store configuration (outline/slides)
    history: List[Dict[str, Any]] = [] # Store history of edits

    class Config:
        from_attributes = True

class DocumentConfig(BaseModel):
    topic: str
    # For Word
    outline: Optional[List[str]] = None
    # For PPTX
    slides: Optional[List[Dict[str, str]]] = None # [{"title": "Slide 1"}, ...]
