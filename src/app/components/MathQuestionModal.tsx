import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Difficulty } from '../App';

interface MathQuestionModalProps {
  difficulty: Difficulty;
  onAnswer: (correct: boolean) => void;
  onClose?: () => void;
  onCorrect?: () => void;
  onIncorrect?: () => void;
}

interface MathQuestion {
  question: string;
  answer: number;
  options: number[];
}

function generateMathQuestion(difficulty: Difficulty): MathQuestion {
  let num1: number, num2: number, operation: string, answer: number;
  
  switch (difficulty) {
    case 'easy':
      // Simple addition and subtraction (1-20)
      num1 = Math.floor(Math.random() * 20) + 1;
      num2 = Math.floor(Math.random() * 20) + 1;
      operation = Math.random() > 0.5 ? '+' : '-';
      answer = operation === '+' ? num1 + num2 : Math.max(num1, num2) - Math.min(num1, num2);
      break;
      
    case 'normal':
      // Multiplication and division with small numbers (1-12)
      num1 = Math.floor(Math.random() * 12) + 1;
      num2 = Math.floor(Math.random() * 12) + 1;
      operation = Math.random() > 0.5 ? '×' : '+';
      answer = operation === '×' ? num1 * num2 : num1 + num2;
      break;
      
    case 'hard':
      // Mixed operations with larger numbers (1-50)
      num1 = Math.floor(Math.random() * 50) + 1;
      num2 = Math.floor(Math.random() * 50) + 1;
      const ops = ['+', '-', '×'];
      operation = ops[Math.floor(Math.random() * ops.length)];
      if (operation === '+') answer = num1 + num2;
      else if (operation === '-') answer = Math.max(num1, num2) - Math.min(num1, num2);
      else answer = num1 * num2;
      break;
      
    case 'hardcore':
      // Complex operations with large numbers
      num1 = Math.floor(Math.random() * 100) + 10;
      num2 = Math.floor(Math.random() * 100) + 10;
      const complexOps = ['+', '-', '×'];
      operation = complexOps[Math.floor(Math.random() * complexOps.length)];
      if (operation === '+') answer = num1 + num2;
      else if (operation === '-') answer = Math.max(num1, num2) - Math.min(num1, num2);
      else answer = num1 * num2;
      break;
      
    default:
      num1 = 5;
      num2 = 5;
      operation = '+';
      answer = 10;
  }
  
  // Generate options (3 wrong + 1 correct)
  const options: number[] = [answer];
  while (options.length < 4) {
    const offset = Math.floor(Math.random() * 20) - 10;
    const wrongAnswer = answer + offset;
    if (wrongAnswer > 0 && !options.includes(wrongAnswer)) {
      options.push(wrongAnswer);
    }
  }
  
  // Shuffle options
  options.sort(() => Math.random() - 0.5);
  
  return {
    question: `${Math.max(num1, num2)} ${operation} ${Math.min(num1, num2)}`,
    answer,
    options,
  };
}

export function MathQuestionModal({ difficulty, onAnswer, onClose, onCorrect, onIncorrect }: MathQuestionModalProps) {
  const [question, setQuestion] = useState<MathQuestion>(() => generateMathQuestion(difficulty));
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (answer: number) => {
    setSelectedAnswer(answer);
    setShowResult(true);
    const isCorrect = answer === question.answer;
    
    setTimeout(() => {
      if (onAnswer) {
        onAnswer(isCorrect);
      }
      if (onCorrect && isCorrect) {
        onCorrect();
      }
      if (onIncorrect && !isCorrect) {
        onIncorrect();
      }
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.8, y: 50, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#FFD43B] to-[#FFA94D] p-6 text-center">
          <h2 className="text-white text-2xl">Matematik Sorusu</h2>
          <p className="text-white/80 text-sm mt-1">Doğru cevabı seç!</p>
        </div>

        {/* Question */}
        <div className="p-8 text-center">
          <div className="bg-gradient-to-br from-[#FFF3BF] to-[#FFE066] rounded-xl p-8 mb-6">
            <div className="text-4xl text-[#495057]">
              {question.question} = ?
            </div>
          </div>

          {/* Options */}
          <div className="grid grid-cols-2 gap-3">
            {question.options.map((option, index) => {
              const isSelected = selectedAnswer === option;
              const isCorrect = option === question.answer;
              const shouldShowCorrect = showResult && isCorrect;
              const shouldShowWrong = showResult && isSelected && !isCorrect;

              return (
                <Button
                  key={index}
                  onClick={() => !showResult && handleAnswer(option)}
                  disabled={showResult}
                  className={`h-16 text-xl transition-all duration-300 ${
                    shouldShowCorrect
                      ? 'bg-[#51CF66] hover:bg-[#51CF66] text-white'
                      : shouldShowWrong
                      ? 'bg-[#FF6B6B] hover:bg-[#FF6B6B] text-white'
                      : 'bg-gradient-to-r from-[#A5D8FF] to-[#74C0FC] hover:from-[#74C0FC] hover:to-[#5DADE2] text-white'
                  }`}
                >
                  {option}
                </Button>
              );
            })}
          </div>

          {/* Result Message */}
          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-6 p-4 rounded-xl ${
                selectedAnswer === question.answer
                  ? 'bg-[#D3F9D8] text-[#2B8A3E]'
                  : 'bg-[#FFE3E3] text-[#C92A2A]'
              }`}
            >
              {selectedAnswer === question.answer ? '✓ Doğru!' : '✗ Yanlış!'}
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
