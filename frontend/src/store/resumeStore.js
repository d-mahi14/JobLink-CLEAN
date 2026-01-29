import { create } from 'zustand';
import { resumesAPI } from '../api/resumes.api';
import { extractSkillsFromResume } from '../utils/skillsExtractor';
import toast from 'react-hot-toast';

export const useResumeStore = create((set, get) => ({
  resumes: [],
  currentResume: null,
  isLoading: false,
  isAnalyzing: false,

  uploadResume: async (resumeFile, fileName) => {
    set({ isLoading: true });
    try {
      // Upload resume first
      const resume = await resumesAPI.uploadResume(resumeFile, fileName);
      
      // Show analyzing toast
      const analyzingToast = toast.loading('Analyzing resume and extracting skills...');
      set({ isAnalyzing: true });
      
      try {
        // Extract skills using AI (mock for now)
        const skills = await extractSkillsFromResume(fileName);
        
        // Update resume with extracted skills
        const analysisData = {
          skills: skills,
          extractedAt: new Date().toISOString(),
          score: Math.floor(Math.random() * 30) + 70, // Mock score 70-100
        };
        
        const updatedResume = await resumesAPI.updateResumeAnalysis(
          resume.id,
          analysisData
        );
        
        toast.success('Resume uploaded and analyzed successfully!', {
          id: analyzingToast,
        });
        
        set({ resumes: [updatedResume, ...get().resumes] });
        return updatedResume;
      } catch (analysisError) {
        console.error('Skills extraction failed:', analysisError);
        toast.error('Resume uploaded but skills analysis failed', {
          id: analyzingToast,
        });
        set({ resumes: [resume, ...get().resumes] });
        return resume;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed');
      throw error;
    } finally {
      set({ isLoading: false, isAnalyzing: false });
    }
  },

  fetchMyResumes: async () => {
    set({ isLoading: true });
    try {
      const resumes = await resumesAPI.getMyResumes();
      set({ resumes });
    } catch (error) {
      toast.error('Failed to fetch resumes');
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  fetchResumeById: async (resumeId) => {
    set({ isLoading: true });
    try {
      const resume = await resumesAPI.getResumeById(resumeId);
      set({ currentResume: resume });
      return resume;
    } catch (error) {
      toast.error('Failed to fetch resume');
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteResume: async (resumeId) => {
    try {
      await resumesAPI.deleteResume(resumeId);
      set({ resumes: get().resumes.filter((r) => r.id !== resumeId) });
      toast.success('Resume deleted successfully');
    } catch (error) {
      toast.error('Failed to delete resume');
      throw error;
    }
  },

  updateResumeAnalysis: async (resumeId, analysisData) => {
    try {
      const updated = await resumesAPI.updateResumeAnalysis(resumeId, analysisData);
      set({
        resumes: get().resumes.map((r) =>
          r.id === resumeId ? updated : r
        ),
      });
      return updated;
    } catch (error) {
      toast.error('Failed to update analysis');
      throw error;
    }
  },
}));