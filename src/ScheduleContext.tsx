import React, { createContext, PropsWithChildren, useContext, useState } from "react";
import { Schedule } from "./types.ts";
import dummyScheduleMap from "./dummyScheduleMap.ts";

interface ScheduleContextType {
  schedulesMap: Record<string, Schedule[]>;
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

interface ScheduleActionsContextType {
  setSchedulesMap: React.Dispatch<React.SetStateAction<Record<string, Schedule[]>>>;
}

const ScheduleActionsContext = createContext<ScheduleActionsContextType | undefined>(undefined);

export const useScheduleContext = () => {
  const context = useContext(ScheduleContext);
  if (context === undefined) {
    throw new Error('useSchedule must be used within a ScheduleProvider');
  }
  return context;
};

export const useScheduleActionsContext = () => {
  const context = useContext(ScheduleActionsContext);
  if (context === undefined) {
    throw new Error('useScheduleActions must be used within a ScheduleActionsProvider');
  }
  return context;
};

export const ScheduleProvider = ({ children }: PropsWithChildren) => {
  const [schedulesMap, setSchedulesMap] = useState<Record<string, Schedule[]>>(dummyScheduleMap);

  return (
    <ScheduleActionsContext.Provider value={{ setSchedulesMap }}>
      <ScheduleContext.Provider value={{ schedulesMap }}>
          {children}
        </ScheduleContext.Provider>
    </ScheduleActionsContext.Provider>
  );
};



