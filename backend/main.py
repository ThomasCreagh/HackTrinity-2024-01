from fastapi import FastAPI
from pydantic import AnyUrl, BaseModel

class WebsiteAssessmentRequest(BaseModel):
    websiteUrl: AnyUrl

app = FastAPI()

@app.post("/api/website-assessment/")
async def assess_website(request: WebsiteAssessmentRequest):
    return {"response": "Looks good to me"}
