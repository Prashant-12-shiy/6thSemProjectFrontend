"use client";

import { PageLoader } from "@/components/page-loader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FeePaymentStatus,
  useGetStudentFeeSummary,
  useInitiateEsewaPayment,
} from "@/services/api/auth/FeeApi";
import {
  CalendarDays,
  CheckCircle2,
  CreditCard,
  ReceiptText,
  ShieldCheck,
  WalletCards,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const months = [
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

const getStatusClasses = (status: FeePaymentStatus) => {
  if (status === "COMPLETE") {
    return "border-green-200 bg-green-50 text-green-700";
  }

  if (status === "FAILED" || status === "CANCELED" || status === "NOT_FOUND") {
    return "border-red-200 bg-red-50 text-red-700";
  }

  return "border-amber-200 bg-amber-50 text-amber-700";
};

const submitEsewaForm = (
  actionUrl: string,
  formData: Record<string, string>
) => {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = actionUrl;

  Object.entries(formData).forEach(([name, value]) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
};

const Page = () => {
  const { data: feeSummary, isLoading } = useGetStudentFeeSummary();
  const { mutate: initiatePayment, isPending } = useInitiateEsewaPayment();
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  useEffect(() => {
    if (!feeSummary?.currentMonth || selectedMonth || selectedYear) {
      return;
    }

    setSelectedMonth(String(feeSummary.currentMonth.month));
    setSelectedYear(String(feeSummary.currentMonth.year));
  }, [feeSummary, selectedMonth, selectedYear]);

  const selectedPayment = useMemo(
    () => {
      const selectedPayments =
        feeSummary?.payments.filter(
          (payment) =>
            payment.month === Number(selectedMonth) &&
            payment.year === Number(selectedYear)
        ) || [];

      return (
        selectedPayments.find((payment) => payment.status === "COMPLETE") ||
        selectedPayments[0]
      );
    },
    [feeSummary?.payments, selectedMonth, selectedYear]
  );

  const selectedPaymentAlreadyExists = useMemo(
    () =>
      Boolean(
        feeSummary?.payments.some(
          (payment) =>
            payment.month === Number(selectedMonth) &&
            payment.year === Number(selectedYear)
        )
      ),
    [feeSummary?.payments, selectedMonth, selectedYear]
  );

  const isPaid = selectedPayment?.status === "COMPLETE";
  const yearOptions = useMemo(() => {
    const currentYear =
      feeSummary?.currentMonth.year || new Date().getFullYear();
    return [currentYear - 1, currentYear, currentYear + 1];
  }, [feeSummary?.currentMonth.year]);

  const handlePayment = () => {
    if (!feeSummary?.monthlyFee) {
      toast.error("Monthly fee is not set for your class yet");
      return;
    }

    initiatePayment(
      {
        month: Number(selectedMonth),
        year: Number(selectedYear),
      },
      {
        onSuccess: (paymentRequest) => {
          submitEsewaForm(paymentRequest.actionUrl, paymentRequest.formData);
        },
      }
    );
  };

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Fees</h1>
          <p className="text-sm text-gray-500">
            Monthly fee payment in Nepali Rupees.
          </p>
        </div>
        <Badge
          variant="outline"
          className="w-fit border-blue-200 bg-blue-50 text-blue-700"
        >
          Grade {feeSummary?.class?.name || "N/A"}
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-md border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <WalletCards className="h-4 w-4" />
            Monthly Fee
          </div>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {formatNpr(feeSummary?.monthlyFee || 0)}
          </p>
        </div>

        <div className="rounded-md border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <CalendarDays className="h-4 w-4" />
            Selected Month
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger>
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month, index) => (
                  <SelectItem key={month} value={String(index + 1)}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger>
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {yearOptions.map((year) => (
                  <SelectItem key={year} value={String(year)}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-md border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <CheckCircle2 className="h-4 w-4" />
            Payment Status
          </div>
          <div className="mt-3">
            <Badge
              variant="outline"
              className={getStatusClasses(selectedPayment?.status || "UNPAID")}
            >
              {selectedPayment?.status || "UNPAID"}
            </Badge>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-gray-200 bg-white p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              eSewa Payment
            </h2>
            <p className="text-sm text-gray-500">
              Sandbox test merchant code: EPAYTEST
            </p>
          </div>
          <Button
            onClick={handlePayment}
            disabled={
              isPending ||
              isPaid ||
              !feeSummary?.monthlyFee ||
              !selectedMonth ||
              !selectedYear
            }
            className="gap-2"
          >
            <CreditCard className="h-4 w-4" />
            {isPaid
              ? "Paid"
              : selectedPaymentAlreadyExists
              ? "Retry with eSewa"
              : "Pay with eSewa"}
          </Button>
        </div>

        <div className="mt-5 grid gap-3 rounded-md border border-dashed border-gray-300 bg-gray-50 p-4 text-sm text-gray-700 md:grid-cols-3">
          <div>
            <p className="font-medium text-gray-900">Test eSewa ID</p>
            <p>9806800001</p>
          </div>
          <div>
            <p className="font-medium text-gray-900">Password</p>
            <p>Nepal@123</p>
          </div>
          <div>
            <p className="font-medium text-gray-900">Token</p>
            <p>123456</p>
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-lg border border-gray-200 bg-white">
        <div className="flex items-center gap-2 border-b border-gray-200 px-5 py-4">
          <ReceiptText className="h-5 w-5 text-gray-600" />
          <h2 className="text-xl font-semibold text-gray-900">
            Payment History
          </h2>
        </div>

        {feeSummary?.payments && feeSummary.payments.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {feeSummary.payments.slice(0, 8).map((payment) => (
              <div
                key={payment._id}
                className="grid gap-3 px-5 py-4 md:grid-cols-[1fr_1fr_1fr_auto]"
              >
                <div>
                  <p className="text-sm text-gray-500">Month</p>
                  <p className="font-medium text-gray-900">
                    {months[payment.month - 1]} {payment.year}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Amount</p>
                  <p className="font-medium text-gray-900">
                    {formatNpr(payment.amount)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Reference</p>
                  <p className="break-all font-medium text-gray-900">
                    {payment.transactionCode || payment.transactionUuid}
                  </p>
                </div>
                <div className="md:text-right">
                  <Badge
                    variant="outline"
                    className={getStatusClasses(payment.status)}
                  >
                    {payment.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 py-10 text-gray-500">
            <ShieldCheck className="h-10 w-10 text-gray-400" />
            <p>No payments yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
