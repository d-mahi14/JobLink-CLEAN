import re
import spacy
from typing import List, Dict, Set
from app.models.schemas import SkillCategory

class SkillExtractor:
    """Extract skills from resume text using NLP and pattern matching"""
    
    def __init__(self):
        # Load spaCy model
        try:
            self.nlp = spacy.load("en_core_web_sm")
        except:
            import os
            os.system("python -m spacy download en_core_web_sm")
            self.nlp = spacy.load("en_core_web_sm")
        
        # Comprehensive skill database
        self.skill_patterns = self._initialize_skill_patterns()
    
    def _initialize_skill_patterns(self) -> Dict[str, List[str]]:
        """Initialize comprehensive skill patterns"""
        return {
            "programming_languages": [
                "python", "javascript", "java", "c++", "c#", "ruby", "php", 
                "swift", "kotlin", "go", "rust", "typescript", "scala", 
                "r", "matlab", "perl", "bash", "shell", "powershell"
            ],
            "web_frameworks": [
                "react", "angular", "vue", "svelte", "next.js", "nuxt.js",
                "django", "flask", "fastapi", "express", "node.js", "spring boot",
                "asp.net", "laravel", "ruby on rails", "phoenix"
            ],
            "databases": [
                "mysql", "postgresql", "mongodb", "redis", "elasticsearch",
                "cassandra", "oracle", "sql server", "sqlite", "dynamodb",
                "firebase", "mariadb", "neo4j", "couchdb", "supabase"
            ],
            "cloud_platforms": [
                "aws", "azure", "gcp", "google cloud", "heroku", "digital ocean",
                "vercel", "netlify", "cloudflare", "oracle cloud"
            ],
            "devops_tools": [
                "docker", "kubernetes", "jenkins", "gitlab ci", "github actions",
                "terraform", "ansible", "chef", "puppet", "vagrant",
                "circleci", "travis ci", "helm", "prometheus", "grafana"
            ],
            "data_science": [
                "machine learning", "deep learning", "tensorflow", "pytorch",
                "scikit-learn", "pandas", "numpy", "keras", "nlp", "computer vision",
                "data analysis", "data visualization", "tableau", "power bi",
                "jupyter", "apache spark", "hadoop"
            ],
            "mobile_development": [
                "react native", "flutter", "swift", "kotlin", "android", "ios",
                "xamarin", "ionic", "cordova"
            ],
            "version_control": [
                "git", "github", "gitlab", "bitbucket", "svn", "mercurial"
            ],
            "testing": [
                "jest", "mocha", "pytest", "selenium", "cypress", "junit",
                "testing", "unit testing", "integration testing", "tdd", "bdd"
            ],
            "methodologies": [
                "agile", "scrum", "kanban", "waterfall", "devops", "ci/cd",
                "microservices", "rest api", "graphql", "soap"
            ],
            "soft_skills": [
                "leadership", "communication", "team collaboration", "problem solving",
                "critical thinking", "time management", "adaptability",
                "project management", "mentoring", "presentation"
            ]
        }
    def _normalize_text(self, text: str) -> str:
        """Normalize text for pattern matching"""
        text = text.lower()
        # Keep characters used in programming names: +, #, ., - 
        text = re.sub(r'[^a-z0-9\s+.#-]', ' ', text)
        # Collapse multiple spaces into one
        text = re.sub(r'\s+', ' ', text)
        return text

    
    def extract_skills(self, text: str) -> List[str]:
        text_lower = self._normalize_text(text)
        found_skills = set()
        
        # Extract using pattern matching
        for category, skills in self.skill_patterns.items():
            for skill in skills:
                # Use word boundaries for exact matching
                pattern = r'\b' + re.escape(skill) + r'\b'
                if re.search(pattern, text_lower):
                    found_skills.add(skill.title())
        
        # Extract using NLP (named entities and noun chunks)
        doc = self.nlp(text)
        
        # Extract technical terms from noun chunks
        #for chunk in doc.noun_chunks:
         #   chunk_text = chunk.text.lower().strip()
          #  if self._is_technical_term(chunk_text):
           #     found_skills.add(chunk.text.title())
        
        return sorted(list(found_skills))
    
    def categorize_skills(self, skills: List[str]) -> SkillCategory:
        categorized = SkillCategory()
        skills_lower = [s.lower() for s in skills]
        
        for skill, skill_lower in zip(skills, skills_lower):
            # Check each category
            if skill_lower in self.skill_patterns["programming_languages"]:
                categorized.languages.append(skill)
            elif skill_lower in self.skill_patterns["web_frameworks"]:
                categorized.frameworks.append(skill)
            elif skill_lower in self.skill_patterns["databases"]:
                categorized.databases.append(skill)
            elif (skill_lower in self.skill_patterns["cloud_platforms"] or 
                  skill_lower in self.skill_patterns["devops_tools"]):
                categorized.tools.append(skill)
            elif skill_lower in self.skill_patterns["soft_skills"]:
                categorized.soft.append(skill)
            else:
                # Check if it's a technical skill
                if (skill_lower in self.skill_patterns.get("data_science", []) or
                    skill_lower in self.skill_patterns.get("mobile_development", []) or
                    skill_lower in self.skill_patterns.get("testing", []) or
                    skill_lower in self.skill_patterns.get("version_control", [])):
                    categorized.technical.append(skill)
                else:
                    categorized.other.append(skill)
        
        return categorized
    
    def _is_technical_term(self, term: str) -> bool:
        """Check if a term is likely a technical skill"""
        # Check if term contains technical keywords
        technical_indicators = [
            "api", "framework", "library", "sdk", "platform", 
            "development", "programming", "design", "architecture"
        ]
        
        return any(indicator in term for indicator in technical_indicators)
    
    def extract_experience_years(self, text: str) -> int:
        """Extract years of experience from resume"""
        # Pattern for "X years of experience"
        patterns = [
            r'(\d+)\+?\s*years?\s+(?:of\s+)?experience',
            r'(\d+)\+?\s*yrs?\s+(?:of\s+)?experience',
            r'experience:\s*(\d+)\+?\s*years?'
        ]
        
        for pattern in patterns:
            match = re.search(pattern, text.lower())
            if match:
                return int(match.group(1))
        
        return 0
    
    def extract_education(self, text: str) -> List[str]:
        """Extract education information"""
        education = []
        
        degrees = [
            "bachelor", "master", "phd", "doctorate", "mba", "b.tech", 
            "m.tech", "b.sc", "m.sc", "b.e", "m.e", "diploma"
        ]
        
        lines = text.split('\n')
        for line in lines:
            line_lower = line.lower()
            if any(degree in line_lower for degree in degrees):
                education.append(line.strip())
        
        return education[:5]  # Limit to 5 entries
    
    def extract_certifications(self, text: str) -> List[str]:
        """Extract certifications"""
        certifications = []
        
        cert_keywords = [
            "certified", "certification", "certificate", "aws", "azure", 
            "google cloud", "pmp", "scrum master", "cissp"
        ]
        
        lines = text.split('\n')
        for line in lines:
            line_lower = line.lower()
            if any(keyword in line_lower for keyword in cert_keywords):
                certifications.append(line.strip())
        
        return certifications[:10]