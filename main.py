import os
import sys
from pathlib import Path

# Add the sql_llm_reasoning_engine directory to sys.path 
# This ensures that internal absolute imports like `from agents import ...` work correctly.
engine_path = Path(__file__).parent / "sql_llm_reasoning_engine"
sys.path.insert(0, str(engine_path.resolve()))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import the existing app from the main module of the engine
from sql_llm_reasoning_engine.main import app as agent_app

app = FastAPI(title="Market Analysis API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health_check():
    """Health check endpoint to ensure the service is running."""
    return {"status": "Market Analysis API running"}

# Mount the agent application at /api
app.mount("/api", agent_app)

if __name__ == "__main__":
    import uvicorn
    # Make sure to run on 7860 or as per PORT for Hugging Face Spaces
    port = int(os.getenv("PORT", 7860))
    uvicorn.run(app, host="0.0.0.0", port=port)
