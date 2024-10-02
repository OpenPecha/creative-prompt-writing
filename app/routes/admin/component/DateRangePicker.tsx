"use client";

import * as React from "react";
import { addDays, format, startOfMonth, subMonths } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { useNavigate, useSearchParams } from "@remix-run/react";

import { cn } from "~/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Button,
  Calendar,
} from "~/components/ui";

export function DatePickerWithRange({
  className,
  dateRange,
}: React.HTMLAttributes<HTMLDivElement>) {
  const today = new Date();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { from, to } = dateRange;

  const [date, setDate] = React.useState<DateRange | undefined>({
    from: from ? new Date(from) : undefined, // Set to today
    to: to ? new Date(to) : undefined, // 10 days from start of previous month
  });

  // Function to disable dates after today
  const disabledDays = { after: new Date() };

  const handleSelect = (selectedRange: DateRange | undefined) => {
    if (selectedRange?.from && selectedRange.to) {
      // Ensure the selected range doesn't exceed today
      const adjustedTo = selectedRange.to > today ? today : selectedRange.to;
      setDate({ from: selectedRange.from, to: adjustedTo });

      // Create new URLSearchParams object
      const newParams = new URLSearchParams(searchParams);
      // Set the from and to parameters
      newParams.set("from", format(selectedRange.from, "yyyy-MM-dd"));
      newParams.set("to", format(adjustedTo, "yyyy-MM-dd"));

      // Navigate to the same route with updated search params
      navigate(`?${newParams.toString()}`, { replace: true });
    } else {
      setDate(selectedRange);
    }
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleSelect}
            numberOfMonths={2}
            disabled={disabledDays}
            className="bg-white"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
