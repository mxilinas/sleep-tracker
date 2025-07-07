import { createContext, ReactNode, useContext, useState } from "react";

export enum SleepQuality {
    GOOD,
    FAIR,
    POOR
}

type SleepData = {
    date: string; // "2025-07-07"
    sleepTime: string; // "22:30"
    wakeTime: string;  // "06:45"
    quality: SleepQuality;   // 1–10
};

type SleepContext = {
    sleepData: SleepData,
    setSleepData: (value: React.SetStateAction<SleepData>) => void;
}

const sleepContext = createContext<SleepContext | undefined>(undefined);

export function useSleep() {
    const context = useContext(sleepContext);
    if (!context) throw new Error('useSleep must be used within a SleepProvider');
    return context;
}

type Props = {
    children: ReactNode;
};

const emptyData: SleepData = {
    date: "",
    sleepTime: "",
    wakeTime: "",
    quality: SleepQuality.GOOD,
}

export function SleepProvider({ children }: Props) {
    const [sleepData, setSleepData] = useState<SleepData>(emptyData);

    return (
        <sleepContext.Provider value={{ sleepData, setSleepData }}>
            {children}
        </sleepContext.Provider>
    );
}
