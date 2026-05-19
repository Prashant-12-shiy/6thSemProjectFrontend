"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface AttendanceRecord {
  _id: string;
  date: string;
  status: "Present" | "Absent" | string;
}

interface AttendanceHistoryProps {
  attendance?: AttendanceRecord[];
}

type AttendanceRange = 1 | 3 | 12 | null;

const rangeLabels: Record<Exclude<AttendanceRange, null>, string> = {
  1: "1 Month",
  3: "3 Months",
  12: "1 Year",
};

export default function AttendanceHistory({
  attendance = [],
}: AttendanceHistoryProps) {
  const [range, setRange] = useState<AttendanceRange>(null);
  const [open, setOpen] = useState(false);

  const filteredAttendance = useMemo(() => {
    if (!range) {
      return [];
    }

    const pastDate = new Date();
    pastDate.setMonth(pastDate.getMonth() - range);

    return attendance
      .filter((record) => new Date(record.date) >= pastDate)
      .sort(
        (firstRecord, secondRecord) =>
          new Date(secondRecord.date).getTime() -
          new Date(firstRecord.date).getTime()
      );
  }, [attendance, range]);

  const handleRangeClick = (nextRange: Exclude<AttendanceRange, null>) => {
    setRange(nextRange);
    setOpen(true);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Attendance History</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {([1, 3, 12] as const).map((rangeOption) => (
            <Button
              key={rangeOption}
              type="button"
              variant={range === rangeOption ? "default" : "outline"}
              onClick={() => handleRangeClick(rangeOption)}
            >
              {rangeLabels[rangeOption]}
            </Button>
          ))}
        </div>

        <Collapsible open={open} onOpenChange={setOpen}>
          <CollapsibleTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              disabled={!range}
            >
              {open ? "Hide Attendance" : "Show Attendance"}
            </Button>
          </CollapsibleTrigger>

          <CollapsibleContent className="mt-3 space-y-3">
            {filteredAttendance.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No attendance records found for this period.
              </p>
            ) : (
              filteredAttendance.map((record) => (
                <Card key={record._id} className="border">
                  <CardContent className="flex items-center justify-between p-4">
                    <div>
                      <p className="font-medium">
                        {new Date(record.date).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(record.date).toLocaleDateString("en-US", {
                          weekday: "long",
                        })}
                      </p>
                    </div>

                    <Badge
                      variant={
                        record.status === "Present" ? "success" : "destructive"
                      }
                    >
                      {record.status}
                    </Badge>
                  </CardContent>
                </Card>
              ))
            )}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}
