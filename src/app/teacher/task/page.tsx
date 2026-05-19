"use client";
import AddTaskForm from "@/components/teacherComponents/AddTaskForm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useGetAssignedTask } from "@/services/api/auth/TeacherApi";
import { format } from "date-fns";
import { Search, Calendar, ClipboardList } from "lucide-react";
import React, { useState, useMemo } from "react";

const Page = () => {
  const { data: assignedTaskData, isLoading } = useGetAssignedTask();
  const [searchQuery, setSearchQuery] = useState("");

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const yesterday = useMemo(() => {
    const d = new Date(today);
    d.setDate(d.getDate() - 1);
    return d;
  }, [today]);

  // Filter tasks based on search query
  const filteredTasks = assignedTaskData?.filter((task: any) =>
    task?.assignedTo?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter yesterday's tasks
  const yesterdayTask = filteredTasks?.filter((task: any) => {
    const taskDate = new Date(task.createdAt);
    taskDate.setHours(0, 0, 0, 0);
    return taskDate.getTime() === yesterday.getTime();
  });

  // Filter today's tasks
  const todayTask = filteredTasks?.filter((task: any) => {
    const taskDate = new Date(task.createdAt);
    taskDate.setHours(0, 0, 0, 0);
    return taskDate.getTime() === today.getTime();
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-900">Tasks</h1>
        <AddTaskForm />
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search tasks by class..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Task Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Yesterday's Tasks */}
        <Card className="bg-white rounded-lg shadow-sm border border-gray-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="text-purple-500" />
              <CardTitle className="text-xl font-semibold text-gray-900">
                Yesterday{"'"}s Tasks
              </CardTitle>
            </div>
            <CardDescription className="text-gray-500">
              Tasks assigned yesterday
            </CardDescription>
          </CardHeader>
          <CardContent>
            {yesterdayTask?.length > 0 ? (
              yesterdayTask.map((task: any, index: number) => (
                <div
                  key={index}
                  className="p-4 mb-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  <p className="text-sm text-gray-700">
                    Class: {task?.assignedTo?.name}
                  </p>
                  <p className="text-sm text-gray-700">Status: {task?.status}</p>
                  <p className="text-sm text-gray-700">
                    Task: {task?.taskContent}
                  </p>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center gap-4 py-8">
                <ClipboardList className="text-gray-400 w-12 h-12" />
                <p className="text-gray-500">No tasks found.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Today's Tasks */}
        <Card className="bg-white rounded-lg shadow-sm border border-gray-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="text-purple-500" />
              <CardTitle className="text-xl font-semibold text-gray-900">
                Today{"'"}s Tasks
              </CardTitle>
            </div>
            <CardDescription className="text-gray-500">
              Tasks assigned today
            </CardDescription>
          </CardHeader>
          <CardContent>
            {todayTask?.length > 0 ? (
              todayTask.map((task: any, index: number) => (
                <div
                  key={index}
                  className="p-4 mb-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  <p className="text-sm text-gray-700">
                    Class: {task?.assignedTo?.name}
                  </p>
                  <p className="text-sm text-gray-700">Status: {task?.status}</p>
                  <p className="text-sm text-gray-700">
                    Task: {task?.taskContent}
                  </p>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center gap-4 py-8">
                <ClipboardList className="text-gray-400 w-12 h-12" />
                <p className="text-gray-500">No tasks found.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Page;
