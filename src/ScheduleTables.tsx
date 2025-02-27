import { Button, ButtonGroup, Flex, Heading, Stack } from "@chakra-ui/react";
import ScheduleTable from "./ScheduleTable.tsx";
import { useScheduleActionsContext, useScheduleContext } from "./ScheduleContext.tsx";
import SearchDialog from "./SearchDialog.tsx";
import React, { useCallback, useState } from "react";
import { useDndContext } from "@dnd-kit/core";
import { Schedule } from "./types.ts";

export const ScheduleTables = () => {
  const { schedulesMap } = useScheduleContext();

  const [searchInfo, setSearchInfo] = useState<{
    tableId: string;
    day?: string;
    time?: number;
  } | null>(null);

  return (
    <>
      <Flex w="full" gap={6} p={6} flexWrap="wrap">
        {Object.entries(schedulesMap).map(([tableId, schedules], index) => {
          return (
            <TableWrapper
              key={tableId}
              tableId={tableId}
              schedules={schedules}
              index={index}
              isDisabledRemoveButton={Object.keys(schedulesMap).length === 1}
              onClickScheduleTime={setSearchInfo}
            />
          )
        })}
      </Flex>
      <SearchDialog searchInfo={searchInfo} onClose={() => setSearchInfo(null)}/>
    </>
  );
}

const TableWrapper = React.memo(({ tableId, schedules, index, isDisabledRemoveButton, onClickScheduleTime }: { tableId: string, schedules: Schedule[], index: number, isDisabledRemoveButton: boolean, onClickScheduleTime: (timeInfo: { tableId: string, day?: string; time?: number }) => void }) => {
  const { setSchedulesMap } = useScheduleActionsContext();
  const dndContext = useDndContext();

  const getActiveTableId = () => {
    const activeId = dndContext.active?.id;
    if (activeId) {
      return String(activeId).split(":")[0];
    }
    return null;
  }
  const activeTableId = getActiveTableId();

  const duplicate = (targetId: string) => {
    setSchedulesMap(prev => ({
      ...prev,
      [`schedule-${Date.now()}`]: [...prev[targetId]]
    }))
  };

  const remove = (targetId: string) => {
    setSchedulesMap(prev => {
      delete prev[targetId];
      return { ...prev };
    })
  };

  const handleScheduleTimeClickHandler = useCallback((timeInfo: { day?: string; time?: number }) => {
    onClickScheduleTime({ tableId, ...timeInfo });
  }, [onClickScheduleTime, tableId]);
  
  const handleDeleteButtonClickHandler = useCallback(({ day, time }: { day: string; time: number }) => {
    setSchedulesMap((prev) => ({
      ...prev,
      [tableId]: prev[tableId].filter(schedule => schedule.day !== day || !schedule.range.includes(time))
    }));
  }, [setSchedulesMap, tableId]);

  return (
    <Stack key={tableId} width="600px">
      <Flex justifyContent="space-between" alignItems="center">
        <Heading as="h3" fontSize="lg">시간표 {index + 1}</Heading>
        <ButtonGroup size="sm" isAttached>
          <Button colorScheme="green" onClick={() => onClickScheduleTime({ tableId })}>시간표 추가</Button>
          <Button colorScheme="green" mx="1px" onClick={() => duplicate(tableId)}>복제</Button>
          <Button colorScheme="green" isDisabled={isDisabledRemoveButton} onClick={() => remove(tableId)}>삭제</Button>
        </ButtonGroup>
      </Flex>
      <ScheduleTable
        key={`schedule-table-${index}`}
        schedules={schedules}
        tableId={tableId}
        isActive={activeTableId === tableId}
        onScheduleTimeClick={handleScheduleTimeClickHandler}
        onDeleteButtonClick={handleDeleteButtonClickHandler}
      />
    </Stack>
  )
})