import google.generativeai as genai
import os
from dotenv import load_dotenv
import asyncio
import time

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)

# Use a model that is likely to have better quota/availability
MODEL_NAME = 'gemini-2.5-flash-lite-preview-09-2025'

async def generate_content_with_retry(prompt: str, retries: int = 3, initial_delay: int = 5) -> str:
    if not api_key:
        raise Exception("Gemini API Key not configured.")
    
    model = genai.GenerativeModel(MODEL_NAME)
    delay = initial_delay
    
    for attempt in range(retries):
        try:
            # Use async generation if available, otherwise run in executor to avoid blocking
            response = await model.generate_content_async(prompt)
            return response.text
        except Exception as e:
            error_str = str(e)
            if ("429" in error_str or "Quota exceeded" in error_str) and attempt < retries - 1:
                print(f"Quota exceeded (429). Retrying in {delay}s... (Attempt {attempt + 1}/{retries})")
                await asyncio.sleep(delay)
                delay *= 2  # Exponential backoff
            else:
                # If it's the last attempt or not a quota error, re-raise
                if attempt == retries - 1:
                    raise e
                raise e
    return ""

async def generate_section_content(topic: str, section_title: str, context: str = "") -> str:
    prompt = f"""
    You are writing a section for a document about "{topic}".
    
    Section Title: {section_title}
    
    Context/Previous Content: {context}
    
    Write the content for this section. Keep it professional, informative, and relevant. 
    Do not include the section title in the output.
    """
    
    try:
        return await generate_content_with_retry(prompt)
    except Exception as e:
        return f"Error generating content: {str(e)}"

async def generate_slide_content(topic: str, slide_title: str) -> dict:
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
        text = await generate_content_with_retry(prompt)
        
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
    prompt = f"""
    Original Content:
    {current_content}
    
    Instruction: {instruction}
    
    Rewrite the content following the instruction. Return only the rewritten content.
    """
    
    try:
        return await generate_content_with_retry(prompt)
    except Exception as e:
        return f"Error refining content: {str(e)}"
