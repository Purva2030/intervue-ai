from pydantic import BaseModel


class CurriculumModule(BaseModel):
    n: int
    title: str
    days: list[int]


class CurriculumDay(BaseModel):
    day: int
    title: str
    type: str
    tools: list[str]
    objectives: list[str]


class Curriculum(BaseModel):
    cohort: str
    modules: list[CurriculumModule]
    days: list[CurriculumDay]