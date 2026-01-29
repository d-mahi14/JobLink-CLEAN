from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class ResumeAnalysisRequest(BaseModel):
    resume_text: str = Field(..., description="Extracted text from resume")
    file_name: str = Field(..., description="Original file name")
    file_type: str = Field(default="pdf", description="File type (pdf/docx)")

class JobMatchRequest(BaseModel):
    resume_text: str = Field(..., description="Resume text")
    job_description: str = Field(..., description="Job description text")
    job_title: str = Field(..., description="Job title")
    required_skills: Optional[List[str]] = Field(default=None, description="Required skills")

class ExtractedSkill(BaseModel):
    skill_name: str
    confidence: float = Field(ge=0.0, le=1.0)
    category: Optional[str] = None

class SkillCategory(BaseModel):
    technical: List[str] = []
    soft: List[str] = []
    tools: List[str] = []
    languages: List[str] = []
    frameworks: List[str] = []
    databases: List[str] = []
    other: List[str] = []

class ResumeAnalysisResponse(BaseModel):
    skills: List[str]
    categorized_skills: SkillCategory
    experience_years: Optional[int] = None
    education: List[str] = []
    certifications: List[str] = []
    contact_info: Dict[str, Any] = {}
    summary: Optional[str] = None
    processed_at: datetime = Field(default_factory=datetime.now)

class MatchScore(BaseModel):
    overall_score: float = Field(ge=0.0, le=100.0)
    skill_match_score: float = Field(ge=0.0, le=100.0)
    experience_match_score: float = Field(ge=0.0, le=100.0)
    matched_skills: List[str] = []
    missing_skills: List[str] = []
    additional_skills: List[str] = []
    recommendations: List[str] = []

class JobMatchResponse(BaseModel):
    match_score: MatchScore
    resume_analysis: ResumeAnalysisResponse
    job_requirements: Dict[str, Any]
    analyzed_at: datetime = Field(default_factory=datetime.now)

class HealthCheck(BaseModel):
    status: str
    message: str
    timestamp: datetime = Field(default_factory=datetime.now)