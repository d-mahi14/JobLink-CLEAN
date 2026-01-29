from fastapi import APIRouter, HTTPException, status
from app.models.schemas import (
    ResumeAnalysisRequest,
    ResumeAnalysisResponse,
    JobMatchRequest,
    JobMatchResponse,
    MatchScore
)
from app.services.resume_parser import ResumeParser
from app.services.match_scorer import MatchScorer
from datetime import datetime

router = APIRouter(prefix="/api/analyze", tags=["Analysis"])

# Initialize services
resume_parser = ResumeParser()
match_scorer = MatchScorer()

@router.post("/resume", response_model=ResumeAnalysisResponse)
async def analyze_resume(request: ResumeAnalysisRequest):
    """
    Analyze a resume and extract skills, experience, education, etc.
    
    - **resume_text**: The extracted text from the resume
    - **file_name**: Original file name
    - **file_type**: File type (pdf/docx)
    """
    try:
        analysis = resume_parser.parse_resume(resume_text=request.resume_text)
        return analysis
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error analyzing resume: {str(e)}"
        )

@router.post("/match", response_model=JobMatchResponse)
async def calculate_job_match(request: JobMatchRequest):
    """
    Calculate match score between a resume and job description
    
    - **resume_text**: Resume text content
    - **job_description**: Job description text
    - **job_title**: Job title
    - **required_skills**: List of required skills (optional)
    """
    try:
        # Parse resume
        resume_analysis = resume_parser.parse_resume(resume_text=request.resume_text)
        
        # Calculate match score
        match_result = match_scorer.calculate_match_score(
            resume_skills=resume_analysis.skills,
            job_description=request.job_description,
            job_required_skills=request.required_skills,
            resume_experience_years=resume_analysis.experience_years or 0,
            resume_text=request.resume_text
        )
        
        # Build match score object
        match_score = MatchScore(
            overall_score=match_result['overall_score'],
            skill_match_score=match_result['skill_match_score'],
            experience_match_score=match_result['experience_match_score'],
            matched_skills=match_result['matched_skills'],
            missing_skills=match_result['missing_skills'],
            additional_skills=match_result['additional_skills'],
            recommendations=match_result['recommendations']
        )
        
        # Build job requirements
        job_requirements = {
            'title': request.job_title,
            'description': request.job_description,
            'required_skills': request.required_skills or match_result['matched_skills']
        }
        
        return JobMatchResponse(
            match_score=match_score,
            resume_analysis=resume_analysis,
            job_requirements=job_requirements,
            analyzed_at=datetime.now()
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error calculating match: {str(e)}"
        )

@router.post("/extract-skills")
async def extract_skills_only(text: str):
    """
    Extract only skills from given text
    
    - **text**: Text to analyze
    """
    try:
        from app.services.skill_extractor import SkillExtractor
        extractor = SkillExtractor()
        
        skills = extractor.extract_skills(text)
        categorized = extractor.categorize_skills(skills)
        
        return {
            "skills": skills,
            "categorized": categorized,
            "count": len(skills)
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error extracting skills: {str(e)}"
        )