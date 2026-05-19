"use client";

import { PageLoader } from "@/components/page-loader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { useGetStudentById } from "@/services/api/auth/StudentApi";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  GraduationCap,
  Mail,
  Phone,
  ReceiptText,
  UserRound,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";

const termOrder = ["First", "Second", "Third", "Final"];

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const formatNpr = (amount: number) => `Rs. ${amount.toLocaleString("en-NP")}`;

const formatDate = (date?: string) => {
  if (!date) {
    return "N/A";
  }

  return new Date(date).toLocaleDateString("en-NP", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getStatusClass = (status?: string) => {
  if (status === "COMPLETE" || status === "Present") {
    return "border-green-200 bg-green-50 text-green-700";
  }

  if (status === "Absent" || status === "FAILED" || status === "CANCELED") {
    return "border-red-200 bg-red-50 text-red-700";
  }

  return "border-amber-200 bg-amber-50 text-amber-700";
};

const InfoItem = ({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) => (
  <div>
    <p className="text-xs font-medium uppercase text-gray-500">{label}</p>
    <p className="mt-1 break-words text-sm font-semibold text-gray-900">
      {value || "N/A"}
    </p>
  </div>
);

const Page = () => {
  const params = useParams();
  const studentId = String(params.slug || "");
  const { data, isLoading, isError, error } = useGetStudentById(studentId);

  if (isLoading) {
    return <PageLoader />;
  }

  if (isError || !data?.student) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <Button asChild variant="outline" className="mb-5 gap-2">
          <Link href="/superadmin/student">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </Button>
        <Card>
          <CardContent className="p-8 text-center text-gray-500">
            {error?.message || "Student information could not be loaded."}
          </CardContent>
        </Card>
      </div>
    );
  }

  const student = data.student;
  const attendanceSummary = data.attendanceSummary;
  const feeSummary = data.feeSummary;
  const latestPayment = feeSummary?.latestPayment;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Button asChild variant="outline" className="w-fit gap-2">
          <Link href="/superadmin/student">
            <ArrowLeft className="h-4 w-4" />
            Back to students
          </Link>
        </Button>
        <Badge variant="outline" className="w-fit border-blue-200 bg-blue-50 text-blue-700">
          Student ID: {student._id}
        </Badge>
      </div>

      <div className="mb-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-gray-200 bg-white">
          <CardContent className="p-6">
            <div className="flex flex-col gap-5 md:flex-row md:items-center">
              <Image
                src={student.profilePicture || "/me.png"}
                alt={student.name || "Student"}
                width={112}
                height={112}
                className="h-28 w-28 rounded-full border object-cover"
              />
              <div className="flex-1">
                <h1 className="text-3xl font-semibold text-gray-900">
                  {student.name}
                </h1>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4" />
                    {student.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <GraduationCap className="h-4 w-4" />
                    Grade {data.class?.name || "N/A"}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <UserRound className="h-4 w-4" />
                    Roll {student.rollNumber}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="h-4 w-4" />
                    {data.class?.teacherInCharge?.name || "Teacher not assigned"}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 bg-white">
          <CardHeader>
            <CardTitle className="text-lg">Guardian</CardTitle>
            <CardDescription>Emergency and parent contact</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <InfoItem label="Guardian Name" value={student.guardianName} />
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-500" />
              <InfoItem label="Guardian Contact" value={student.guardianContact} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-white">
          <CardContent className="p-5">
            <p className="text-sm text-gray-500">Attendance</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">
              {attendanceSummary?.percentage || 0}%
            </p>
            <p className="text-xs text-gray-500">
              {attendanceSummary?.presentDays || 0} present of{" "}
              {attendanceSummary?.totalDays || 0}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardContent className="p-5">
            <p className="text-sm text-gray-500">Courses</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">
              {data.courses?.length || 0}
            </p>
            <p className="text-xs text-gray-500">Assigned to this class</p>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardContent className="p-5">
            <p className="text-sm text-gray-500">Monthly Fee</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">
              {formatNpr(feeSummary?.monthlyFee || 0)}
            </p>
            <p className="text-xs text-gray-500">Nepali Rupees</p>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardContent className="p-5">
            <p className="text-sm text-gray-500">Total Paid</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">
              {formatNpr(feeSummary?.totalPaid || 0)}
            </p>
            <p className="text-xs text-gray-500">
              {feeSummary?.paidCount || 0} completed payments
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <UserRound className="h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <InfoItem label="Name" value={student.name} />
            <InfoItem label="Email" value={student.email} />
            <InfoItem label="Role" value={student.role} />
            <InfoItem label="Roll Number" value={student.rollNumber} />
            <InfoItem label="Class" value={data.class?.name} />
            <InfoItem label="Section" value={data.class?.section} />
            <InfoItem label="Created" value={formatDate(student.createdAt)} />
            <InfoItem label="Updated" value={formatDate(student.updatedAt)} />
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <CalendarDays className="h-5 w-5" />
              Attendance Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <InfoItem label="Total Days" value={attendanceSummary?.totalDays} />
            <InfoItem label="Present Days" value={attendanceSummary?.presentDays} />
            <InfoItem label="Absent Days" value={attendanceSummary?.absentDays} />
            <InfoItem label="Late Days" value={attendanceSummary?.lateDays} />
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <BookOpen className="h-5 w-5" />
            Grades
          </CardTitle>
          <CardDescription>All term grades recorded for this student.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course</TableHead>
                <TableHead>Teacher</TableHead>
                <TableHead>First</TableHead>
                <TableHead>Second</TableHead>
                <TableHead>Third</TableHead>
                <TableHead>Final</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.grades?.length ? (
                data.grades.map((grade: any) => {
                  const termGrades = [...(grade.termGrades || [])].sort(
                    (firstTerm: any, secondTerm: any) =>
                      termOrder.indexOf(firstTerm.term) -
                      termOrder.indexOf(secondTerm.term)
                  );

                  return (
                    <TableRow key={grade._id}>
                      <TableCell className="font-medium">
                        {grade.course?.name || "N/A"}
                      </TableCell>
                      <TableCell>{grade.course?.teacher?.name || "N/A"}</TableCell>
                      {termOrder.map((term) => {
                        const termGrade = termGrades.find(
                          (item: any) => item.term === term
                        );

                        return (
                          <TableCell key={term}>
                            {termGrade ? (
                              <div>
                                <p className="font-medium">
                                  {termGrade.mark} marks
                                </p>
                                <p className="text-xs text-gray-500">
                                  {termGrade.grade}
                                  {termGrade.remarks
                                    ? ` - ${termGrade.remarks}`
                                    : ""}
                                </p>
                              </div>
                            ) : (
                              "N/A"
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-20 text-center text-gray-500">
                    No grades recorded.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="mt-6 bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <GraduationCap className="h-5 w-5" />
            Class Courses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead>Teacher</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.courses?.length ? (
                data.courses.map((course: any) => (
                  <TableRow key={course._id}>
                    <TableCell className="font-medium">{course.name}</TableCell>
                    <TableCell>{course.code}</TableCell>
                    <TableCell>{course.credits}</TableCell>
                    <TableCell>{course.teacher?.name || "N/A"}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-20 text-center text-gray-500">
                    No courses assigned.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <CalendarDays className="h-5 w-5" />
              Recent Attendance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.attendance?.length ? (
                  data.attendance.slice(0, 8).map((record: any) => (
                    <TableRow key={record._id}>
                      <TableCell>{formatDate(record.date)}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getStatusClass(record.status)}
                        >
                          {record.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={2}
                      className="h-20 text-center text-gray-500"
                    >
                      No attendance records.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <ReceiptText className="h-5 w-5" />
              Fee Records
            </CardTitle>
            <CardDescription>
              Latest status: {latestPayment?.status || "No payment yet"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Month</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.payments?.length ? (
                  data.payments.slice(0, 8).map((payment: any) => (
                    <TableRow key={payment._id}>
                      <TableCell>
                        {monthNames[payment.month - 1]} {payment.year}
                      </TableCell>
                      <TableCell>{formatNpr(payment.amount || 0)}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getStatusClass(payment.status)}
                        >
                          {payment.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="h-20 text-center text-gray-500"
                    >
                      No fee payments recorded.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Page;
