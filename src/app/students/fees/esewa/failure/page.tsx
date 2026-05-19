"use client";

import { Button } from "@/components/ui/button";
import { useMarkEsewaPaymentFailed } from "@/services/api/auth/FeeApi";
import { XCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useRef } from "react";

const EsewaFailureContent = () => {
  const searchParams = useSearchParams();
  const transactionUuid = searchParams.get("transaction_uuid") || undefined;
  const hasMarkedFailed = useRef(false);
  const { mutate: markFailed } = useMarkEsewaPaymentFailed();

  useEffect(() => {
    if (hasMarkedFailed.current) {
      return;
    }

    hasMarkedFailed.current = true;
    markFailed({ transaction_uuid: transactionUuid });
  }, [markFailed, transactionUuid]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 text-center shadow-sm">
        <XCircle className="mx-auto h-12 w-12 text-red-600" />
        <h1 className="mt-4 text-2xl font-semibold text-gray-900">
          Payment cancelled
        </h1>
        <p className="mt-2 text-gray-500">
          The eSewa payment was not completed.
        </p>
        <Button asChild className="mt-6 w-full">
          <Link href="/students/fees">Back to fees</Link>
        </Button>
      </div>
    </div>
  );
};

const Page = () => (
  <Suspense fallback={<div className="p-6">Loading...</div>}>
    <EsewaFailureContent />
  </Suspense>
);

export default Page;
