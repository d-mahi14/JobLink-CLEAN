export const extractSkillsFromResume = async (fileName) => {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock skills extraction (replace with actual AI agent call)
  const mockSkills = [
    'JavaScript', 'React', 'Node.js', 'Python', 'SQL',
    'Git', 'REST APIs', 'Problem Solving', 'Team Collaboration',
    'Agile', 'TypeScript', 'MongoDB', 'AWS', 'Docker'
  ];
  
  // Return random subset of skills
  const numSkills = Math.floor(Math.random() * 5) + 5; // 5-10 skills
  return mockSkills
    .sort(() => 0.5 - Math.random())
    .slice(0, numSkills);
};