"use client";

import { PageLoader } from "@/components/page-loader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FeePaymentStatus,
  useGetFeePayments,
  useGetFeeStructures,
  useUpdateFeeStructure,
} from "@/services/api/auth/FeeApi";
import { Banknote, ReceiptText, Save, Users } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const formatNpr = (amount: number) => `Rs. ${amount.toLocaleString("en-NP")}`;

const getStatusClasses = (status: FeePaymentStatus) => {
  if (status === "COMPLETE") {
    return "border-green-200 bg-green-50 text-green-700";
  }

  if (status === "FAILED" || status === "CANCELED" || status === "NOT_FOUND") {
    return "border-red-200 bg-red-50 text-red-700";
  }

  return "border-amber-200 bg-amber-50 text-amber-700";
};

const Page = () => {
  const { data: feeStructures, isLoading: isFeeLoading } =
    useGetFeeStructures();
  const { data: payments, isLoading: isPaymentLoading } = useGetFeePayments();
  const { mutate: updateFeeStructure, isPending } = useUpdateFeeStructure();
  const [feeInputs, setFeeInputs] = useState<Record<string, string>>({});
  const [savingClassId, setSavingClassId] = useState<string | null>(null);

  useEffect(() => {
    if (!feeStructures) {
      return;
    }

    const nextInputs: Record<string, string> = {};
    feeStructures.forEach((feeStructure) => {
      nextInputs[feeStructure.classId] = feeStructure.monthlyFee
        ? String(feeStructure.monthlyFee)
        : "";
    });
    setFeeInputs(nextInputs);
  }, [feeStructures]);

  const totalMonthlyFees = useMemo(
    () =>
      feeStructures?.reduce(
        (total, feeStructure) => total + Number(feeStructure.monthlyFee || 0),
        0
      ) || 0,
    [feeStructures]
  );

  const paidThisMonth = useMemo(() => {
    const now = new Date();
    return (
      payments?.filter(
        (payment) =>
          payment.status === "COMPLETE" &&
          payment.month === now.getMonth() + 1 &&
          payment.year === now.getFullYear()
      ).length || 0
    );
  }, [payments]);

  const handleSave = (classId: string) => {
    const monthlyFee = Number(feeInputs[classId]);

    if (!Number.isFinite(monthlyFee) || monthlyFee < 0) {
      toast.error("Enter a valid monthly fee in Nepali Rupees");
      return;
    }

    setSavingClassId(classId);
    updateFeeStructure(
      { classId, monthlyFee },
      {
        onSettled: () => setSavingClassId(null),
      }
    );
  };

  if (isFeeLoading || isPaymentLoading) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 dark:bg-gray-900">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Fee Structure
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Class-wise monthly fees in Nepali Rupees.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-md border border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Banknote className="h-4 w-4" />
              Monthly total
            </div>
            <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">
              {formatNpr(totalMonthlyFees)}
            </p>
          </div>
          <div className="rounded-md border border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <ReceiptText className="h-4 w-4" />
              Paid this month
            </div>
            <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">
              {paidThisMonth}
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Class</TableHead>
              <TableHead>Teacher</TableHead>
              <TableHead>Students</TableHead>
              <TableHead>Monthly Fee</TableHead>
              <TableHead>Saved Fee</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {feeStructures?.map((feeStructure) => (
              <TableRow key={feeStructure.classId}>
                <TableCell className="font-medium">
                  Grade {feeStructure.className}
                </TableCell>
                <TableCell>
                  {feeStructure.teacherInCharge?.name || "Not assigned"}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    {feeStructure.studentsCount}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex max-w-[180px] items-center gap-2">
                    <span className="text-sm text-gray-500">Rs.</span>
                    <Input
                      type="number"
                      min="0"
                      value={feeInputs[feeStructure.classId] || ""}
                      onChange={(event) =>
                        setFeeInputs((currentInputs) => ({
                          ...currentInputs,
                          [feeStructure.classId]: event.target.value,
                        }))
                      }
                      className="h-9"
                    />
                  </div>
                </TableCell>
                <TableCell>{formatNpr(feeStructure.monthlyFee || 0)}</TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    onClick={() => handleSave(feeStructure.classId)}
                    disabled={
                      isPending && savingClassId === feeStructure.classId
                    }
                    className="gap-2"
                  >
                    <Save className="h-4 w-4" />
                    Save
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-8">
        <div className="mb-4 flex items-center gap-2">
          <ReceiptText className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Recent eSewa Payments
          </h2>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Month</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Reference</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments && payments.length > 0 ? (
                payments.slice(0, 10).map((payment) => (
                  <TableRow key={payment._id}>
                    <TableCell>
                      <div className="font-medium">
                        {payment.student?.name || "Student"}
                      </div>
                      <div className="text-xs text-gray-500">
                        Roll {payment.student?.rollNumber || "N/A"}
                      </div>
                    </TableCell>
                    <TableCell>Grade {payment.class?.name || "N/A"}</TableCell>
                    <TableCell>
                      {payment.month}/{payment.year}
                    </TableCell>
                    <TableCell>{formatNpr(payment.amount)}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={getStatusClasses(payment.status)}
                      >
                        {payment.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {payment.transactionCode || payment.transactionUuid}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-24 text-center text-gray-500"
                  >
                    No fee payments yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Page;
