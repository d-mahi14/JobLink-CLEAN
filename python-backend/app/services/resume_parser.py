from typing import Dict, Any
from datetime import datetime
from app.models.schemas import ResumeAnalysisResponse, SkillCategory
from app.services.skill_extractor import SkillExtractor
from app.utils.pdf_extractor import DocumentExtractor

class ResumeParser:
    """Main resume parsing orchestrator"""
    
    def __init__(self):
        self.skill_extractor = SkillExtractor()
        self.doc_extractor = DocumentExtractor()
    
    def parse_resume(
        self, 
        resume_text: str = None,
        base64_content: str = None,
        file_type: str = "pdf"
    ) -> ResumeAnalysisResponse:
        """
        Parse resume and extract all information
        
        Args:
            resume_text: Pre-extracted resume text (optional)
            base64_content: Base64 encoded file (optional)
            file_type: File type (pdf or docx)
            
        Returns:
            Complete resume analysis
        """
        # Extract text if not provided
        if not resume_text and base64_content:
            resume_text = self.doc_extractor.extract_from_base64(
                base64_content, 
                file_type
            )
        
        if not resume_text:
            raise ValueError("Either resume_text or base64_content must be provided")
        
        # Extract skills
        skills = self.skill_extractor.extract_skills(resume_text)
        
        # Categorize skills
        categorized_skills = self.skill_extractor.categorize_skills(skills)
        
        # Extract experience
        experience_years = self.skill_extractor.extract_experience_years(resume_text)
        
        # Extract education
        education = self.skill_extractor.extract_education(resume_text)
        
        # Extract certifications
        certifications = self.skill_extractor.extract_certifications(resume_text)
        
        # Extract contact info
        contact_info = self.doc_extractor.extract_contact_info(resume_text)
        
        # Generate summary
        summary = self._generate_summary(skills, experience_years, education)
        
        return ResumeAnalysisResponse(
            skills=skills,
            categorized_skills=categorized_skills,
            experience_years=experience_years,
            education=education,
            certifications=certifications,
            contact_info=contact_info,
            summary=summary,
            processed_at=datetime.now()
        )
    
    def _generate_summary(
        self, 
        skills: list, 
        experience_years: int, 
        education: list
    ) -> str:
        """Generate a brief summary of the resume"""
        summary_parts = []
        
        if experience_years > 0:
            summary_parts.append(f"{experience_years}+ years of experience")
        
        if skills:
            top_skills = skills[:5]
            summary_parts.append(f"Skilled in {', '.join(top_skills)}")
        
        if education:
            summary_parts.append(f"Education: {education[0]}")
        
        return ". ".join(summary_parts) if summary_parts else "Resume analyzed"

