import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)

async def generate_section_content(topic: str, section_title: str, context: str = "") -> str:
    if not api_key:
        return "Error: Gemini API Key not configured."
    
    model = genai.GenerativeModel('gemini-pro')
    prompt = f"""
    You are writing a section for a document about "{topic}".
    
    Section Title: {section_title}
    
    Context/Previous Content: {context}
    
    Write the content for this section. Keep it professional, informative, and relevant. 
    Do not include the section title in the output.
    """
    
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Error generating content: {str(e)}"

async def generate_slide_content(topic: str, slide_title: str) -> dict:
    if not api_key:
        return {"bullets": ["Error: Gemini API Key not configured."], "notes": ""}
    
    model = genai.GenerativeModel('gemini-pro')
    prompt = f"""
    You are creating a PowerPoint slide for a presentation about "{topic}".
    
    Slide Title: {slide_title}
    
    Generate 3-5 bullet points for this slide and speaker notes.
    Format the output exactly as follows:
    BULLETS:
    - Point 1
    - Point 2
    
    NOTES:
    Speaker notes here...
    """
    
    try:
        response = model.generate_content(prompt)
        text = response.text
        
        bullets = []
        notes = ""
        
        # Simple parsing
        if "BULLETS:" in text:
            parts = text.split("NOTES:")
            bullet_part = parts[0].replace("BULLETS:", "").strip()
            if len(parts) > 1:
                notes = parts[1].strip()
            
            for line in bullet_part.split('\n'):
                if line.strip().startswith('-') or line.strip().startswith('*'):
                    bullets.append(line.strip().lstrip('-* ').strip())
        else:
            # Fallback if format is not respected
            bullets = [text]
            
        return {"bullets": bullets, "notes": notes}
    except Exception as e:
        return {"bullets": [f"Error: {str(e)}"], "notes": ""}

async def refine_content(current_content: str, instruction: str) -> str:
    if not api_key:
        return "Error: Gemini API Key not configured."
    
    model = genai.GenerativeModel('gemini-pro')
    prompt = f"""
    Original Content:
    {current_content}
    
    Instruction: {instruction}
    
    Rewrite the content following the instruction. Return only the rewritten content.
    """
    
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Error refining content: {str(e)}"
