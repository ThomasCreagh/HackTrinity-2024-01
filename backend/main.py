import diskcache as dc
import hashlib
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import AnyUrl, BaseModel

from assessment import assess_policy
from scrape import get_tos


cache = dc.Cache('./cache')

def generate_hash_key(text: str) -> str:
    text_bytes = text.encode('utf-8')
    hash_object = hashlib.sha256(text_bytes)
    return hash_object.hexdigest()


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
    text = get_tos(str(request.websiteUrl))
    hash_key = generate_hash_key(text)

    if hash_key in cache:
        filtered_results = cache[hash_key]
    else:
        results = assess_policy(text)
        filtered_results = [item for item in results if item["result"] == True]
        cache[hash_key] = filtered_results
    
    return {"response": "Looks good to me", "results": filtered_results}
