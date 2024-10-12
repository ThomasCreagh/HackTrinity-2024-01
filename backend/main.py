from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import AnyUrl, BaseModel

from assessment import assess_policy


class WebsiteAssessmentRequest(BaseModel):
    websiteUrl: AnyUrl


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/api/website-assessment/")
async def assess_website(request: WebsiteAssessmentRequest):
    with open('sample_policy.txt', 'r', encoding="utf-8") as file:
        text = file.read()
    
    results = assess_policy(text)
    filtered_results = [item for item in results if item["result"] == True]
    
    return {"response": "Looks good to me", "results": filtered_results}
