from dotenv import load_dotenv
import json
from langchain_core.prompts import PromptTemplate
from langchain_openai import ChatOpenAI
from langchain.output_parsers import PydanticOutputParser
from pydantic import BaseModel, Field
import sqlite3

load_dotenv()


class CriterionResult(BaseModel):
    id: int = Field(description="id of the criterion")
    result: bool = Field(description="boolean result of whether the criterion is satisfied")

class CriteriaResults(BaseModel):
    results: list[CriterionResult] = Field(description="results of evaluating all criteria")

model = ChatOpenAI(model="gpt-4o")

parser = PydanticOutputParser(pydantic_object=CriteriaResults)

prompt = PromptTemplate(
    template=("You are an expert analysing a legal document outlining a policy."
              "Your job is to assess whether the content of the document satisfies a set of criteria."
              "\nYou'll be given the criteria in JSON format, with an id corresponding to each criterion."
              "\n{format_instructions}"
              "\nHere are the criteria: {criteria_json_string}"
              "\nHere is the text of the document to assess: \n\n\n{text}"),
    input_variables=["criteria_json_string", "text"],
    partial_variables={"format_instructions": parser.get_format_instructions()},
)

chain = prompt | model | parser


class AssessmentResult:
    general_score: str
    failed_criteria: list[dict]

    def __init__(self, general_score, failed_criteria):
        self.general_score = general_score
        self.failed_criteria = failed_criteria

def assess_policy(text: str) -> AssessmentResult:
    conn = sqlite3.connect('assessment.db')
    cursor = conn.cursor()
    cursor.execute("SELECT id, criterion, level FROM criteria")
    rows = cursor.fetchall()
    criteria_list = [{"id": row[0], "criterion": row[1], "level": row[2]} for row in rows]
    conn.close()
    criteria_json = json.dumps(criteria_list)

    result: CriteriaResults = chain.invoke({"criteria_json_string": criteria_json, "text": text})
    
    failed_criteria = []
    for res in result.results:
        item = next((item for item in criteria_list if item["id"] == res.id), None)
        failed_criteria.append({
            "id": res.id, 
            "result": res.result, 
            "criterion": item["criterion"],
            "level": item["level"]
        })
    failed_criteria = [item for item in failed_criteria if item["result"] == True]

    general_score = (
        "bad" if any(item["level"] == "major" for item in failed_criteria) else
        "medium" if sum(1 for item in failed_criteria if item["level"] == "mild") > 3 else
        "good"
    )

    return AssessmentResult(general_score, failed_criteria)
