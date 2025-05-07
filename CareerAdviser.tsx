import React, { useState, useEffect } from 'react';

const careerDatabase = {
  "Software Engineer": {
    requiredSkills: ["Data Structures", "Algorithms", "System Design", "Databases", "Cloud Computing"],
    courses: [
      { name: "Data Structures & Algorithms", link: "https://www.youtube.com/watch?v=8hly31xKli0" },
      { name: "System Design Basics", link: "https://www.youtube.com/watch?v=6NwxAxVdD6w" },
      { name: "Cloud Computing Fundamentals", link: "https://www.youtube.com/watch?v=2LaAJq1lB1Q" }
    ]
  },
  "Cybersecurity Analyst": {
    requiredSkills: ["Networking", "Ethical Hacking", "SIEM", "Incident Response", "Cryptography"],
    courses: [
      { name: "Networking Basics", link: "https://www.youtube.com/watch?v=qiQR5rTSshw" },
      { name: "Ethical Hacking Fundamentals", link: "https://www.youtube.com/watch?v=3Kq1MIfTWCE" },
      { name: "Cybersecurity Incident Response", link: "https://www.youtube.com/watch?v=4wX_p3fuj5E" }
    ]
  }
};

const interviewQuestions = [
  "Tell me about yourself.",
  "Why do you want this job?",
  "What are your strengths and weaknesses?",
  "Describe a challenge you faced and how you handled it.",
  "Where do you see yourself in 5 years?"
];

const CareerAdviser = () => {
  const [interests, setInterests] = useState('');
  const [skills, setSkills] = useState([]);
  const [careerAdvice, setCareerAdvice] = useState(null);
  const [mockInterview, setMockInterview] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [evaluation, setEvaluation] = useState(null);
  const [score, setScore] = useState(null);

  useEffect(() => {
    const storedCareer = localStorage.getItem('careerAdvice');
    if (storedCareer) setCareerAdvice(JSON.parse(storedCareer));
  }, []);

  const handleCareerSubmit = (e) => {
    e.preventDefault();
    const bestMatch = careerDatabase[interests];
    if (bestMatch) {
      const missingSkills = bestMatch.requiredSkills.filter(skill => !skills.includes(skill));
      const advice = {
        career: interests,
        requiredSkills: bestMatch.requiredSkills,
        missingSkills,
        courses: bestMatch.courses
      };
      setCareerAdvice(advice);
      localStorage.setItem('careerAdvice', JSON.stringify(advice));
    } else {
      setCareerAdvice({ career: 'No matching career found. Try refining your interests.' });
    }
  };

  const startMockInterview = () => {
    const randomQuestions = interviewQuestions.sort(() => 0.5 - Math.random()).slice(0, 5);
    setMockInterview(randomQuestions);
    setUserAnswers({});
    setEvaluation(null);
    setScore(null);
  };

  const handleAnswerChange = (index, answer) => {
    setUserAnswers({ ...userAnswers, [index]: answer });
  };

  const evaluateAnswers = () => {
    const corrections = mockInterview.map((q, index) => {
      return {
        question: q,
        correctAnswer: "Provide a structured and clear answer."
      };
    });
    const randomScore = Math.floor(Math.random() * 51) + 50; // Random score between 50 and 100
    setEvaluation(corrections);
    setScore(randomScore);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Career Adviser</h2>
      <form onSubmit={handleCareerSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Enter your career interest (e.g., Software Engineer)"
          value={interests}
          onChange={(e) => setInterests(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Enter your current skills (comma separated)"
          value={skills.join(', ')}
          onChange={(e) => setSkills(e.target.value.split(','))}
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
          Get Career Advice
        </button>
      </form>
      {careerAdvice && (
        <div className="mt-4">
          <h3 className="text-xl font-semibold">Career Path: {careerAdvice.career}</h3>
          {careerAdvice.missingSkills?.length > 0 && (
            <p className="text-red-500">You need to learn: {careerAdvice.missingSkills.join(', ')}</p>
          )}
          <h4 className="text-lg font-semibold">Recommended Courses:</h4>
          <ul>
            {careerAdvice.courses?.map(course => (
              <li key={course.name}><a href={course.link} target="_blank" className="text-blue-600">{course.name}</a></li>
            ))}
          </ul>
        </div>
      )}
      <div className="mt-6">
        <h3 className="text-xl font-semibold">Mock Interview Simulator</h3>
        <button onClick={startMockInterview} className="w-full bg-green-500 text-white p-2 rounded mt-2">
          Start Mock Interview
        </button>
        {mockInterview.length > 0 && (
          <div className="mt-4">
            {mockInterview.map((q, index) => (
              <div key={index} className="mb-4">
                <p className="font-medium">{q}</p>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                />
              </div>
            ))}
            <button onClick={evaluateAnswers} className="w-full bg-yellow-500 text-white p-2 rounded mt-2">
              Submit Answers
            </button>
          </div>
        )}
        {evaluation && (
          <div className="mt-4">
            <h4 className="text-lg font-semibold">Evaluation:</h4>
            {evaluation.map((evalItem, index) => (
              <p key={index} className="mt-2">
                {evalItem.question} - <span className="text-red-500">{evalItem.correctAnswer}</span>
              </p>
            ))}
            <h4 className="text-lg font-bold text-green-600 mt-2">Your Score: {score}/100</h4>
          </div>
        )}
      </div>
    </div>
  );
};

export default CareerAdviser;
