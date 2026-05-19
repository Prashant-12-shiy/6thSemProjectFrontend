"use client";
import EventsAndNotice from "@/components/dashboardComponents/EventsAndNotice";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetTask } from "@/services/api/auth/StudentApi";
import { Search, BookOpen, ClipboardList } from "lucide-react";
import React, { useState, useMemo } from "react";

const Page = () => {
  const { data: task, isLoading } = useGetTask();
  const [searchQuery, setSearchQuery] = useState("");

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  // Filter tasks to show only today's homework
  const todaysHomework = task?.filter((task: any) => {
    const taskDate = new Date(task.createdAt);
    taskDate.setHours(0, 0, 0, 0);
    return taskDate.getTime() === today.getTime();
  });

  // Further filter by subject search
  const filteredTasks = todaysHomework?.filter((task: any) => {
    const subjectName = task?.teacher?.course?.name;
    return subjectName?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-900">Dashboard</h1>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search homework by subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Homework and Events Section */}
      <div className="flex gap-6 max-md:flex-col">
        {/* Homework Card */}
        <Card className="w-full bg-white rounded-lg shadow-sm border border-gray-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <ClipboardList className="text-purple-500" />
              <CardTitle className="text-xl font-semibold text-gray-900">
                Today{"'"}s Homework
              </CardTitle>
            </div>
            <CardDescription className="text-gray-500">
              Complete this homework
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredTasks?.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-gray-700 font-semibold">
                      Subject
                    </TableHead>
                    <TableHead className="text-gray-700 font-semibold">
                      Task
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTasks.map((task: any, index: number) => (
                    <TableRow
                      key={index}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <TableCell>{task?.teacher?.course?.name}</TableCell>
                      <TableCell>{task?.taskContent}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex flex-col items-center justify-center gap-4 py-8">
                <BookOpen className="text-gray-400 w-12 h-12" />
                <p className="text-gray-500">No homework found.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Events and Notices Section */}
        <EventsAndNotice />
      </div>
    </div>
  );
};

export default Page;
