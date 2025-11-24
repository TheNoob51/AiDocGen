import firebase_admin
from firebase_admin import credentials, firestore
import os
from dotenv import load_dotenv

load_dotenv()

# Initialize Firebase Admin SDK
# Expects GOOGLE_APPLICATION_CREDENTIALS env var to point to the service account file
# OR we can pass a dict if we load it from a secret manager
cred_path = os.getenv("FIREBASE_CREDENTIALS_PATH")

if not firebase_admin._apps:
    if cred_path and os.path.exists(cred_path):
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)
    else:
        print("Warning: Firebase credentials not found. Firebase features will not work.")
        # For development without creds, we might want to mock or just fail gracefully
        # firebase_admin.initialize_app() # This might work if using GCloud CLI default creds

def get_db():
    if not firebase_admin._apps:
        return None
    return firestore.client()
