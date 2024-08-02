import React, { createContext, useState } from 'react';

export const DiaryContext = createContext();

export const DiaryProvider = ({ children }) => {
    const [diary, setDiary] = useState({
        date: '',
        content: '',
        q_a: { question: '', answer: '' },
        emotion: '',
    });

    const updateDiary = (newData) => {
        setDiary((prevDiary) => {
            // q_a 병합 로직 추가
            const updatedQA = {
                question: newData.q_a?.question !== undefined 
                    ? `${prevDiary.q_a.question}${newData.q_a.question ? `, ${newData.q_a.question}` : ''}`
                    : prevDiary.q_a.question,
                answer: newData.q_a?.answer !== undefined 
                    ? `${prevDiary.q_a.answer}${newData.q_a.answer ? `, ${newData.q_a.answer}` : ''}`
                    : prevDiary.q_a.answer,
            };

            return {
                ...prevDiary,
                ...newData,
                q_a: updatedQA,
            };
        });
    };

    return (
        <DiaryContext.Provider value={{ diary, updateDiary }}>
            {children}
        </DiaryContext.Provider>
    );
};
