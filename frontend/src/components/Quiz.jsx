import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "./ui/button";
// import Waves from "./ReactBeats/Waves"; // Import Waves component
import Squares from "./ReactBeats/Squares"; // Import Squares component

function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_URL}/quiz`, {
          withCredentials: true,
        });
        setQuestions(response.data.quiz);
      } catch (err) {
        setError("Failed to load quiz data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (questions.length > 0) {
      setUserAnswers(new Array(questions.length).fill(""));
    }
  }, [questions]);

  const handleAnswerChange = (index, event) => {
    const updatedAnswers = [...userAnswers];
    updatedAnswers[index] = event.target.value;
    setUserAnswers(updatedAnswers);
  };

  const calculateScore = async () => {
    let score = 0;
    questions.forEach((question, index) => {
      if (userAnswers[index] === question.answer) {
        score++;
      }
    });
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_URL}/quiz/marks`,
        { score },
        { withCredentials: true }
      );
      setIsSubmitted(true);
      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-600 to-gray-300 flex flex-col items-center justify-center py-8 px-4 relative">
      <div className="absolute top-0 left-0 w-full h-full">
        <Squares 
          speed={0.5} 
          squareSize={30}
          direction='diagonal' // up, down, left, right, diagonal
          borderColor='#fff'
          hoverFillColor='#222'
        />
      </div>
      <h1 className="text-4xl font-bold text-white mb-6 text-center z-20">React Quiz</h1>
      {isLoading ? (
        <div className="flex items-center justify-center space-x-4">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 border-white border-t-transparent rounded-full"></div>
          <p className="text-2xl text-white">Loading quiz...</p>
        </div>
      ) : error ? (
        <div className="text-red-600 text-xl bg-white p-4 rounded-lg shadow-md">{error}</div>
      ) : (
        <form className="w-full max-w-3xl bg-slate-100 z-10 rounded-lg shadow-lg p-6 space-y-6">
          {questions.map((q, index) => (
            <div key={index} className="space-y-4">
              <p className="text-xl font-semibold text-gray-800">{q.question}</p>
              <div className="space-y-2">
                {q.options.map((option, optionIndex) => (
                  <div key={optionIndex} className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name={`question-${index}`}
                      id={`option-${index}-${optionIndex}`}
                      value={option}
                      checked={userAnswers[index] === option}
                      onChange={(e) => handleAnswerChange(index, e)}
                      className="h-5 w-5 text-blue-500 border-gray-300 focus:ring-blue-500"
                      aria-label={`Option ${option}`}
                    />
                    <label
                      htmlFor={`option-${index}-${optionIndex}`}
                      className={`text-lg cursor-pointer ${
                        isSubmitted
                          ? userAnswers[index] === option
                            ? option === q.answer
                              ? "text-green-500"
                              : "text-red-500"
                            : option === q.answer
                            ? "text-green-500"
                            : ""
                          : ""
                      }`}
                    >
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="flex justify-center gap-4 mt-6">
            <button
              type="button"
              onClick={calculateScore}
              disabled={isSubmitted}
              className={`px-6 py-2 bg-blue-700 text-white rounded-lg shadow-md transition duration-300 
                ${
                  isSubmitted
                    ? "opacity-80 cursor-not-allowed"
                    : "hover:bg-blue-800"
                }`}
            >
              Submit
            </button>
            {isSubmitted && (
              <Button
                onClick={() => window.location.reload()}
                className="bg-green-600 text-white hover:bg-green-700 px-6 py-2 rounded-lg shadow-md"
              >
                Re-Quiz
              </Button>
            )}
          </div>
        </form>
      )}
    </div>
  );
}

export default Quiz;
