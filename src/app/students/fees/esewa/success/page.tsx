"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useConfirmEsewaPayment } from "@/services/api/auth/FeeApi";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useRef } from "react";

const EsewaSuccessContent = () => {
  const searchParams = useSearchParams();
  const encodedData = searchParams.get("data");
  const hasConfirmed = useRef(false);
  const {
    mutate: confirmPayment,
    data: confirmation,
    error,
    isError,
    isPending,
  } = useConfirmEsewaPayment();

  useEffect(() => {
    if (!encodedData || hasConfirmed.current) {
      return;
    }

    hasConfirmed.current = true;
    confirmPayment({ data: encodedData });
  }, [confirmPayment, encodedData]);

  const paymentComplete = confirmation?.payment?.status === "COMPLETE";

  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 text-center shadow-sm">
        {isPending && (
          <>
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-600" />
            <h1 className="mt-4 text-2xl font-semibold text-gray-900">
              Verifying payment
            </h1>
          </>
        )}

        {!isPending && paymentComplete && (
          <>
            <CheckCircle2 className="mx-auto h-12 w-12 text-green-600" />
            <h1 className="mt-4 text-2xl font-semibold text-gray-900">
              Payment complete
            </h1>
            <p className="mt-2 text-gray-500">
              Your fee payment has been recorded.
            </p>
          </>
        )}

        {!isPending && (isError || !paymentComplete) && (
          <>
            <XCircle className="mx-auto h-12 w-12 text-red-600" />
            <h1 className="mt-4 text-2xl font-semibold text-gray-900">
              Payment not verified
            </h1>
            <p className="mt-2 text-gray-500">
              {error?.message || confirmation?.message || "Missing eSewa data."}
            </p>
          </>
        )}

        {confirmation?.payment?.status && (
          <Badge variant="outline" className="mt-4">
            {confirmation.payment.status}
          </Badge>
        )}

        <Button asChild className="mt-6 w-full">
          <Link href="/students/fees">Back to fees</Link>
        </Button>
      </div>
    </div>
  );
};

const Page = () => (
  <Suspense fallback={<div className="p-6">Loading...</div>}>
    <EsewaSuccessContent />
  </Suspense>
);

export default Page;
