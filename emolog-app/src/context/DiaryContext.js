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
        setDiary((prevDiary) => ({
            ...prevDiary,
            ...newData,
        }));
    };

    return (
        <DiaryContext.Provider value={{ diary, updateDiary }}>
            {children}
        </DiaryContext.Provider>
    );
};
