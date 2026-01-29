import axios from 'axios';

const PYTHON_API_URL = process.env.PYTHON_API_URL || 'http://localhost:8000';

/**
 * Analyze resume with Python AI backend
 * @param {string} resumeText - Extracted text from resume
 * @param {string} fileName - Original file name
 * @returns {Promise<Object>} Analysis results with skills, experience, etc.
 */
export const analyzeResumeWithAI = async (resumeText, fileName) => {
  try {
    const response = await axios.post(
      `${PYTHON_API_URL}/api/analyze/resume`,
      {
        resume_text: resumeText,
        file_name: fileName,
        file_type: fileName.endsWith('.pdf') ? 'pdf' : 'docx'
      },
      {
        timeout: 30000, // 30 seconds
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Python API - Resume analysis error:', error.message);
    // Return null to allow graceful fallback
    return null;
  }
};

/**
 * Calculate match score between resume and job
 * @param {string} resumeText - Resume content
 * @param {string} jobDescription - Job description
 * @param {string} jobTitle - Job title
 * @param {Array<string>} requiredSkills - List of required skills (optional)
 * @returns {Promise<Object>} Match results with scores and recommendations
 */
export const calculateJobMatch = async (resumeText, jobDescription, jobTitle, requiredSkills = null) => {
  try {
    const response = await axios.post(
      `${PYTHON_API_URL}/api/analyze/match`,
      {
        resume_text: resumeText,
        job_description: jobDescription,
        job_title: jobTitle,
        required_skills: requiredSkills
      },
      {
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Python API - Match calculation error:', error.message);
    return null;
  }
};

/**
 * Extract skills from text
 * @param {string} text - Text to analyze
 * @returns {Promise<Object>} Extracted skills
 */
export const extractSkills = async (text) => {
  try {
    const response = await axios.post(
      `${PYTHON_API_URL}/api/analyze/extract-skills`,
      { text },
      {
        timeout: 15000,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Python API - Skill extraction error:', error.message);
    return { skills: [], categorized: {}, count: 0 };
  }
};

/**
 * Check if Python API is available
 * @returns {Promise<boolean>}
 */
export const checkPythonAPIHealth = async () => {
  try {
    const response = await axios.get(`${PYTHON_API_URL}/health`, {
      timeout: 5000
    });
    return response.data.status === 'healthy';
  } catch (error) {
    console.error('Python API health check failed:', error.message);
    return false;
  }
};