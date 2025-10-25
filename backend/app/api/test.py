from fastapi import APIRouter, HTTPException
from app.services.agent import agent

router = APIRouter(prefix="/test", tags=["test"])

@router.get("/test-agent-hello")
async def test_agent_hello():
    prompt = "Say hello and confirm you are the abstract worker agent."
    
    try:
        # agent.run() returns a RunOutput object when stream=False
        run_output = agent.run(prompt)
        
        # Access the content attribute from RunOutput
        full_response_text = run_output.content
        
        return {
            "status": "Agent successfully returned a response",
            "prompt": prompt,
            "response": full_response_text
        }

    except Exception as e:
        import traceback
        print(traceback.format_exc())  # Debug: print full error
        raise HTTPException(
            status_code=500, 
            detail=f"Agent test failed: {e}"
        )