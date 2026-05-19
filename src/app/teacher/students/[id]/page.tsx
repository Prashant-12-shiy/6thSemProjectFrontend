"use client";
import { PageLoader } from "@/components/page-loader";
import AddGradeForm from "@/components/teacherComponents/AddGradeForm";
import UpdateGradeForm from "@/components/teacherComponents/UpdateGradeForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { useGetMyDetails, useGetStudentById } from "@/services/api/auth/TeacherApi";
import {
  isWithinInterval,
  parseISO,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from "date-fns";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Search, Calendar, BookOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import AttendanceHistory from "@/components/teacherComponents/StudentAttendance";
import TermReportPDF from "@/components/teacherComponents/GradeReportGenerator";

const Page = () => {
  const [attendanceSummary, setAttendanceSummary] = useState({
    week: 0,
    month: 0,
    year: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const params = useParams();
  const id = String(params.id || "");

  const { data: studentData, isLoading } = useGetStudentById(id);
  const {data: teacherData, isLoading: teacherDataLoading} = useGetMyDetails();
  const teachername = teacherData?.name;


  useEffect(() => {
    if (!studentData?.attendance) return;

    const today = new Date();
    const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 }); // Monday as start of the week
    const startOfCurrentMonth = startOfMonth(today);
    const startOfCurrentYear = startOfYear(today);

    let weekCount = 0;
    let monthCount = 0;
    let yearCount = 0;

    studentData.attendance.forEach(
      (attendance: { date: any; status: string }) => {
        const attendanceDate = parseISO(attendance.date); // Convert to Date object

        if (attendance.status === "Present") {
          if (
            isWithinInterval(attendanceDate, {
              start: startOfCurrentWeek,
              end: today,
            })
          ) {
            weekCount++;
          }
          if (
            isWithinInterval(attendanceDate, {
              start: startOfCurrentMonth,
              end: today,
            })
          ) {
            monthCount++;
          }
          if (
            isWithinInterval(attendanceDate, {
              start: startOfCurrentYear,
              end: today,
            })
          ) {
            yearCount++;
          }
        }
      }
    );

    setAttendanceSummary({
      week: weekCount,
      month: monthCount,
      year: yearCount,
    });
  }, [studentData]);

  if (isLoading || teacherDataLoading) {
    return <PageLoader />;
  }

  // Filter grades based on search query
  const filteredGrades = studentData?.grades?.filter((grade: any) =>
    grade?.course?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Student Profile Section */}
      <div className="flex gap-5 items-center">
        <Image
          className="rounded-full object-cover border-2 border-purple-500"
          src="/me.png"
          alt="profile"
          width={80}
          height={80}
        />
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">
            {studentData?.student?.name}
          </h1>
          <p className="text-gray-500">
            Roll Number: {studentData?.student?.rollNumber}
          </p>
        </div>
      </div>

      {/* Attendance Summary Section */}
      <Card className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900">
            Attendance Record
          </CardTitle>
          <CardDescription className="text-gray-500">
            Attendance summary for {studentData?.student?.name}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <Calendar className="text-purple-500" />
              <h3 className="text-lg font-semibold text-purple-900">
                Weekly Attendance
              </h3>
            </div>
            <p className="text-gray-700 mt-2">
              {attendanceSummary.week} Present
            </p>
            <Progress value={(attendanceSummary.week / 5) * 100} className="mt-2 bg-purple-200" />
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <Calendar className="text-purple-500" />
              <h3 className="text-lg font-semibold text-purple-900">
                Monthly Attendance
              </h3>
            </div>
            <p className="text-gray-700 mt-2">
              {attendanceSummary.month} Present
            </p>
            <Progress value={(attendanceSummary.month / 20) * 100} className="mt-2 bg-purple-200" />
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <Calendar className="text-purple-500" />
              <h3 className="text-lg font-semibold text-purple-900">
                Yearly Attendance
              </h3>
            </div>
            <p className="text-gray-700 mt-2">
              {attendanceSummary.year} Present
            </p>
            <Progress value={(attendanceSummary.year / 200) * 100} className="mt-2 bg-purple-200" />
          </div>
        </CardContent>
      </Card>
      

      <div className="mt-8">
        <AttendanceHistory attendance={studentData?.attendance || []} />
      </div>


      {/* Grade Record Section */}
      <Card className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-semibold text-gray-900">
              Grade Record
            </CardTitle>
            <AddGradeForm studentName={studentData?.student?.name} studentCourses={studentData?.courses} />
          </div>
          <CardDescription className="text-gray-500">
            Grade summary for {studentData?.student?.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by subject..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-gray-700 font-semibold">
                  Subject Name
                </TableHead>
                <TableHead className="text-gray-700 font-semibold">
                  First Term
                </TableHead>
                <TableHead className="text-gray-700 font-semibold">
                  Second Term
                </TableHead>
                <TableHead className="text-gray-700 font-semibold">
                  Third Term
                </TableHead>
                <TableHead className="text-gray-700 font-semibold">
                  Final Term
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGrades?.length > 0 ? (
                filteredGrades.map((grade: any, index: number) => (
                  <TableRow key={index} className="hover:bg-gray-50 transition-colors">
                    <TableCell>{grade?.course?.name}</TableCell>
                    {grade?.termGrades
                      ?.sort((a: any, b: any) => {
                        const termOrder = ["First", "Second", "Third", "Final"];
                        return termOrder.indexOf(a.term) - termOrder.indexOf(b.term);
                      })
                      .map((termgrade: any, index: number) => (
                        <TableCell key={index}>
                          <div className="flex items-center gap-3">
                            <div>
                              <span className="text-red-500">
                                {termgrade?.mark} Mark
                              </span>{" "}
                              <br />
                              {termgrade?.grade}{" "}
                              <span className="text-xs text-gray-500">
                                ({termgrade?.remarks})
                              </span>
                            </div>
                            <UpdateGradeForm
                              studentGradeData={termgrade}
                              studentId={studentData?.student?._id}
                              courseId={grade?.course?._id}
                            />
                          </div>
                        </TableCell>
                      ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="flex flex-col items-center justify-center gap-4">
                      <BookOpen className="text-gray-400 w-12 h-12" />
                      <p className="text-gray-500">No grades found.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
     <TermReportPDF
  studentData={studentData}
  filteredGrades={filteredGrades}
  classTeacherName={teachername}
/>

    </div>
  );
};

export default Page;
