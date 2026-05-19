"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { useAddTask, useGetTeacherClasses } from "@/services/api/auth/TeacherApi";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectValue,
} from "@/components/ui/select";
import { SelectTrigger } from "@radix-ui/react-select";

const AddTaskForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [assignedTo, setAssignedTo] = useState("");
  const [taskContent, setTaskContent] = useState("");
  const { mutate: AddTaskMutation } = useAddTask();
  const { data: classes } = useGetTeacherClasses();
  const { handleSubmit } = useForm();

  const handleCreateTask = () => {
    const newData = {
        assignedTo,
        taskContent
    }

    AddTaskMutation(newData, {
      onSuccess: () => {
        setIsOpen(false);
        setTaskContent("");
        setAssignedTo("");
      },
    });
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <Button className="h-8 bg-white border-black/50 max-md:text-sm max-md:px-1 text-black border shadow-lg hover:bg-slate-100 hover:scale-105">
          Add New Task
        </Button>
      </DialogTrigger>
      <DialogContent className="max-md:max-w-[90vw] max-md:rounded-md">
        <form
          onSubmit={handleSubmit(handleCreateTask)}
          className="flex flex-col gap-4"
        >
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
            <DialogDescription className="text-xs">
              Please fill out the form below to add a new task to the system.
              Once submitted, the task will be visible to students.
            </DialogDescription>
          </DialogHeader>
          <Separator className="bg-black" />

          <Label>Task</Label>
          <Textarea onChange={(e) => setTaskContent(e.target.value)} />

          <div>
            <Label>Assigned To</Label> <br />
            <Select onValueChange={(value) => setAssignedTo(value)}>
              <SelectTrigger className="w-[180px] border rounded-sm">
                <SelectValue placeholder="Select a Class" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Classes</SelectLabel>
                  {classes?.map((cls: { _id: string; name: string }) => (
                    <SelectItem key={cls._id} value={cls.name}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <Separator />
          <Button type="submit">Create</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskForm;
