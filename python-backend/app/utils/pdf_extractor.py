import io
import base64
import re
from typing import Optional
import PyPDF2
import pdfplumber
from docx import Document

class DocumentExtractor:
    """Extract text from PDF and DOCX files"""
    
    @staticmethod
    def extract_from_base64(base64_string: str, file_type: str = "pdf") -> str:
        try:
            # Remove data URL prefix if present
            if "," in base64_string:
                base64_string = base64_string.split(",")[1]
            
            # Decode base64
            file_bytes = base64.b64decode(base64_string)
            
            if file_type.lower() == "pdf":
                return DocumentExtractor._extract_from_pdf(file_bytes)
            elif file_type.lower() in ["docx", "doc"]:
                return DocumentExtractor._extract_from_docx(file_bytes)
            else:
                raise ValueError(f"Unsupported file type: {file_type}")
                
        except Exception as e:
            raise Exception(f"Error extracting text: {str(e)}")
    
    @staticmethod
    def _extract_from_pdf(file_bytes: bytes) -> str:
        """Extract text from PDF bytes using pdfplumber (better accuracy)"""
        text = ""
        
        try:
            # Try pdfplumber first (better for complex PDFs)
            with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
        except:
            # Fallback to PyPDF2
            try:
                pdf_reader = PyPDF2.PdfReader(io.BytesIO(file_bytes))
                for page in pdf_reader.pages:
                    text += page.extract_text() + "\n"
            except Exception as e:
                raise Exception(f"Failed to extract PDF text: {str(e)}")
        
        return DocumentExtractor._clean_text(text)
    
    @staticmethod
    def _extract_from_docx(file_bytes: bytes) -> str:
        """Extract text from DOCX bytes"""
        try:
            doc = Document(io.BytesIO(file_bytes))
            text = "\n".join([paragraph.text for paragraph in doc.paragraphs])
            return DocumentExtractor._clean_text(text)
        except Exception as e:
            raise Exception(f"Failed to extract DOCX text: {str(e)}")
    
    @staticmethod
    def _clean_text(text: str) -> str:
        """Clean and normalize extracted text for better skill matching"""
        # Remove zero-width characters
        text = re.sub(r'\u200b', '', text)
        # Normalize all whitespace to single space
        text = re.sub(r'[^\S\r\n]+', ' ', text)
        # Normalize newlines
        text = re.sub(r'[\r\n]+', '\n', text)
        # Remove leading/trailing spaces
        text = text.strip()
        return text

    
    @staticmethod
    def extract_contact_info(text: str) -> dict:
        """Extract contact information from text"""
        contact_info = {}
        
        # Extract email
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        emails = re.findall(email_pattern, text)
        if emails:
            contact_info['email'] = emails[0]
        
        # Extract phone numbers
        phone_pattern = r'(?:\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}'
        phones = re.findall(phone_pattern, text)

        if phones:
            contact_info['phone'] = phones[0] if isinstance(phones[0], str) else ''.join(phones[0])
        
        # Extract LinkedIn
        linkedin_pattern = r'linkedin\.com/in/[\w-]+'
        linkedin = re.findall(linkedin_pattern, text, re.IGNORECASE)
        if linkedin:
            contact_info['linkedin'] = linkedin[0]
        
        # Extract GitHub
        github_pattern = r'github\.com/[\w-]+'
        github = re.findall(github_pattern, text, re.IGNORECASE)
        if github:
            contact_info['github'] = github[0]
        
        return contact_info