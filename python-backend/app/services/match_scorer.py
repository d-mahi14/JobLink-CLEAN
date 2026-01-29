from typing import List, Dict, Tuple
from sentence_transformers import SentenceTransformer, util
import re

class MatchScorer:
    """Calculate match score between resume and job description"""
    
    def __init__(self):
        # Load sentence transformer for semantic similarity
        try:
            self.model = SentenceTransformer('all-MiniLM-L6-v2')
        except:
            print("Downloading sentence transformer model...")
            self.model = SentenceTransformer('all-MiniLM-L6-v2')
    
    def calculate_match_score(
        self, 
        resume_skills: List[str],
        job_description: str,
        job_required_skills: List[str] = None,
        resume_experience_years: int = 0,
        resume_text: str = ""
    ) -> Dict:
        """
        Calculate comprehensive match score
        
        Args:
            resume_skills: List of skills from resume
            job_description: Job description text
            job_required_skills: Explicitly required skills
            resume_experience_years: Years of experience
            resume_text: Full resume text for context
            
        Returns:
            Dictionary with detailed match scores
        """
        # Extract skills from job description if not provided
        if not job_required_skills:
            job_required_skills = self._extract_job_skills(job_description)
        
        # Calculate skill match
        skill_match = self._calculate_skill_match(resume_skills, job_required_skills)
        
        # Calculate experience match
        required_experience = self._extract_required_experience(job_description)
        experience_match = self._calculate_experience_match(
            resume_experience_years, 
            required_experience
        )
        
        # Calculate semantic similarity
        semantic_score = self._calculate_semantic_similarity(
            resume_text,
            job_description
        )
        
        # Calculate overall score (weighted average)
        overall_score = (
            skill_match['score'] * 0.5 +      # 50% weight on skills
            experience_match * 0.25 +          # 25% weight on experience
            semantic_score * 0.25              # 25% weight on semantic match
        )
        
        # Generate recommendations
        recommendations = self._generate_recommendations(
            skill_match['missing_skills'],
            skill_match['matched_skills'],
            resume_experience_years,
            required_experience
        )
        
        return {
            'overall_score': round(overall_score, 2),
            'skill_match_score': round(skill_match['score'], 2),
            'experience_match_score': round(experience_match, 2),
            'semantic_similarity_score': round(semantic_score, 2),
            'matched_skills': skill_match['matched_skills'],
            'missing_skills': skill_match['missing_skills'],
            'additional_skills': skill_match['additional_skills'],
            'recommendations': recommendations
        }
    
    def _calculate_skill_match(
        self, 
        resume_skills: List[str], 
        required_skills: List[str]
    ) -> Dict:
        """Calculate skill matching score"""
        if not required_skills:
            return {
                'score': 80.0,  # Default score if no requirements
                'matched_skills': resume_skills[:10],
                'missing_skills': [],
                'additional_skills': resume_skills
            }
        
        resume_skills_lower = [s.lower() for s in resume_skills]
        required_skills_lower = [s.lower() for s in required_skills]
        
        # Find matches (exact and partial)
        matched = []
        missing = []
        
        for req_skill in required_skills:
            req_skill_lower = req_skill.lower()
            
            # Exact match
            if req_skill_lower in resume_skills_lower:
                matched.append(req_skill)
            else:
                # Partial match (fuzzy)
                found = False
                for resume_skill in resume_skills:
                    if (req_skill_lower in resume_skill.lower() or 
                        resume_skill.lower() in req_skill_lower):
                        matched.append(req_skill)
                        found = True
                        break
                
                if not found:
                    missing.append(req_skill)
        
        # Find additional skills
        additional = [
            skill for skill in resume_skills 
            if skill.lower() not in required_skills_lower
        ]
        
        # Calculate score
        if len(required_skills) > 0:
            match_percentage = (len(matched) / len(required_skills)) * 100
        else:
            match_percentage = 80.0
        
        # Bonus for additional relevant skills
        bonus = min(len(additional) * 2, 20)  # Max 20 bonus points
        final_score = min(match_percentage + bonus, 100)
        
        return {
            'score': final_score,
            'matched_skills': matched,
            'missing_skills': missing,
            'additional_skills': additional[:10]  # Limit to top 10
        }
    
    def _calculate_experience_match(
        self, 
        resume_years: int, 
        required_years: int
    ) -> float:
        """Calculate experience match score"""
        if required_years == 0:
            return 80.0  # Default if no requirement
        
        if resume_years >= required_years:
            # Perfect match or exceeds
            excess = resume_years - required_years
            if excess <= 2:
                return 100.0
            else:
                return 95.0  # Slightly lower if over-qualified
        else:
            # Under-qualified
            shortfall = required_years - resume_years
            penalty = shortfall * 15  # 15 points per year short
            return max(100 - penalty, 0)
    
    def _calculate_semantic_similarity(
        self, 
        resume_text: str, 
        job_description: str
    ) -> float:
        """Calculate semantic similarity using embeddings"""
        try:
            # Encode texts
            resume_embedding = self.model.encode(resume_text[:1000], convert_to_tensor=True)
            job_embedding = self.model.encode(job_description[:1000], convert_to_tensor=True)
            
            # Calculate cosine similarity
            similarity = util.cos_sim(resume_embedding, job_embedding)
            
            # Convert to percentage
            return float(similarity[0][0]) * 100
        except:
            # Fallback to keyword overlap
            return self._keyword_similarity(resume_text, job_description)
    
    def _keyword_similarity(self, text1: str, text2: str) -> float:
        """Fallback keyword-based similarity"""
        words1 = set(text1.lower().split())
        words2 = set(text2.lower().split())
        
        intersection = words1.intersection(words2)
        union = words1.union(words2)
        
        if len(union) == 0:
            return 0.0
        
        return (len(intersection) / len(union)) * 100
    
    def _extract_job_skills(self, job_description: str) -> List[str]:
        """Extract skills from job description"""
        # Common technical skills patterns
        common_skills = [
            "python", "javascript", "react", "node.js", "java", "sql",
            "aws", "docker", "kubernetes", "git", "agile", "rest api",
            "mongodb", "postgresql", "typescript", "angular", "vue",
            "machine learning", "data analysis", "ci/cd"
        ]
        
        job_lower = job_description.lower()
        found_skills = []
        
        for skill in common_skills:
            if re.search(r'\b' + re.escape(skill) + r'\b', job_lower):
                found_skills.append(skill.title())
        
        return found_skills
    
    def _extract_required_experience(self, job_description: str) -> int:
        """Extract required years of experience from job description"""
        patterns = [
            r'(\d+)\+?\s*years?\s+(?:of\s+)?experience',
            r'(\d+)\+?\s*yrs?\s+experience',
            r'minimum\s+(\d+)\s+years?',
            r'at least\s+(\d+)\s+years?'
        ]
        
        for pattern in patterns:
            match = re.search(pattern, job_description.lower())
            if match:
                return int(match.group(1))
        
        return 0
    
    def _generate_recommendations(
        self,
        missing_skills: List[str],
        matched_skills: List[str],
        resume_experience: int,
        required_experience: int
    ) -> List[str]:
        """Generate improvement recommendations"""
        recommendations = []
        
        if missing_skills:
            if len(missing_skills) <= 3:
                recommendations.append(
                    f"Consider learning: {', '.join(missing_skills[:3])} to improve your match"
                )
            else:
                recommendations.append(
                    f"Focus on acquiring these key skills: {', '.join(missing_skills[:3])}"
                )
        
        if required_experience > resume_experience:
            gap = required_experience - resume_experience
            recommendations.append(
                f"You may need {gap} more year(s) of experience for this role"
            )
        
        if matched_skills:
            recommendations.append(
                f"Great! You match {len(matched_skills)} required skills"
            )
        
        if not recommendations:
            recommendations.append("Excellent match! You meet most requirements")
        
        return recommendations