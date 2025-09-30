"use client";

interface WordListProps {
  words: string[]; 
  foundWords: string[]; 
}

const WordList: React.FC<WordListProps> = ({ words, foundWords }) => {
  return (
    <div className="mt-4 p-4 bg-orange-100 rounded shadow-md">
      <h2 className="text-lg font-semibold text-orange-800 mb-2">Words to Find:</h2>
      <ul className="flex flex-wrap gap-2">
        {words.map((word) => {
          const isFound = foundWords.includes(word.toUpperCase());
          return (
            <li
              key={word}
              className={`px-2 py-1 rounded ${
                isFound
                  ? "bg-green-500 text-white line-through"
                  : "bg-white text-orange-700 font-medium"
              }`}
            >
              {word.toUpperCase()}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default WordList;
