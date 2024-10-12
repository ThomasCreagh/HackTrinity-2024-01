from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import AnyUrl, BaseModel


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
    return {"response": "Looks good to me"}
