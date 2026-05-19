import axiosInstance from "@/services/axiosInstance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export type FeePaymentStatus =
  | "INITIATED"
  | "PENDING"
  | "COMPLETE"
  | "FAILED"
  | "CANCELED"
  | "NOT_FOUND"
  | "AMBIGUOUS"
  | "FULL_REFUND"
  | "PARTIAL_REFUND"
  | "UNPAID";

export interface FeeStructureItem {
  _id?: string;
  classId: string;
  className: string;
  section?: string;
  teacherInCharge?: {
    name: string;
  } | null;
  studentsCount: number;
  monthlyFee: number;
  currency: "NPR";
  updatedAt?: string;
}

export interface FeePaymentItem {
  _id: string;
  student?: {
    name: string;
    rollNumber: string;
    email?: string;
  };
  class?: {
    name: string;
  };
  month: number;
  year: number;
  amount: number;
  currency: "NPR";
  status: FeePaymentStatus;
  paymentMethod: "eSewa";
  transactionUuid: string;
  transactionCode?: string;
  paidAt?: string;
  createdAt: string;
}

export interface StudentFeeSummary {
  student: {
    _id: string;
    name: string;
    rollNumber: string;
  };
  class: {
    _id: string;
    name: string;
    section?: string;
  };
  currentMonth: {
    month: number;
    year: number;
  };
  feeStructureId?: string;
  monthlyFee: number;
  currency: "NPR";
  currentPaymentStatus: FeePaymentStatus;
  payments: FeePaymentItem[];
}

interface UpdateFeeStructureInput {
  classId: string;
  monthlyFee: number;
}

interface InitiateEsewaPaymentInput {
  month: number;
  year: number;
}

interface ConfirmEsewaPaymentInput {
  data: string;
}

interface MarkEsewaFailedInput {
  transaction_uuid?: string;
}

export interface EsewaPaymentRequest {
  actionUrl: string;
  formData: Record<string, string>;
  payment: FeePaymentItem;
  testCredentials: {
    eSewaIds: string[];
    password: string;
    token: string;
    productCode: string;
  };
}

export interface EsewaConfirmResponse {
  message: string;
  payment: FeePaymentItem;
  verification: {
    decodedStatus: string;
    checkedStatus: string;
    statusCheckError?: string;
  };
}

const getErrorMessage = (error: any, fallback: string) =>
  error?.response?.data?.message || error?.response?.data?.data || fallback;

const getFeeStructures = async () => {
  try {
    const response = await axiosInstance.get("/api/superadmin/fee-structures");
    return response.data;
  } catch (error: any) {
    throw new Error(getErrorMessage(error, "Error fetching fee structures"));
  }
};

export const useGetFeeStructures = () => {
  return useQuery<FeeStructureItem[]>({
    queryKey: ["feeStructures"],
    queryFn: getFeeStructures,
  });
};

const updateFeeStructure = async (data: UpdateFeeStructureInput) => {
  try {
    const response = await axiosInstance.post(
      "/api/superadmin/fee-structures",
      data
    );
    return response.data;
  } catch (error: any) {
    throw new Error(getErrorMessage(error, "Error updating monthly fee"));
  }
};

export const useUpdateFeeStructure = () => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, UpdateFeeStructureInput>({
    mutationFn: updateFeeStructure,
    onSuccess: () => {
      toast.success("Monthly fee updated");
      queryClient.invalidateQueries({ queryKey: ["feeStructures"] });
      queryClient.invalidateQueries({ queryKey: ["studentFeeSummary"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

const getFeePayments = async () => {
  try {
    const response = await axiosInstance.get("/api/superadmin/fee-payments");
    return response.data;
  } catch (error: any) {
    throw new Error(getErrorMessage(error, "Error fetching fee payments"));
  }
};

export const useGetFeePayments = () => {
  return useQuery<FeePaymentItem[]>({
    queryKey: ["feePayments"],
    queryFn: getFeePayments,
  });
};

const getStudentFeeSummary = async () => {
  try {
    const response = await axiosInstance.get("/api/student/fees");
    return response.data;
  } catch (error: any) {
    throw new Error(getErrorMessage(error, "Error fetching fee summary"));
  }
};

export const useGetStudentFeeSummary = () => {
  return useQuery<StudentFeeSummary>({
    queryKey: ["studentFeeSummary"],
    queryFn: getStudentFeeSummary,
  });
};

const initiateEsewaPayment = async (data: InitiateEsewaPaymentInput) => {
  try {
    const response = await axiosInstance.post(
      "/api/student/fees/esewa/initiate",
      data
    );
    return response.data;
  } catch (error: any) {
    throw new Error(getErrorMessage(error, "Error initiating eSewa payment"));
  }
};

export const useInitiateEsewaPayment = () => {
  const queryClient = useQueryClient();

  return useMutation<EsewaPaymentRequest, Error, InitiateEsewaPaymentInput>({
    mutationFn: initiateEsewaPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["studentFeeSummary"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

const confirmEsewaPayment = async (data: ConfirmEsewaPaymentInput) => {
  try {
    const response = await axiosInstance.post(
      "/api/student/fees/esewa/confirm",
      data
    );
    return response.data;
  } catch (error: any) {
    throw new Error(getErrorMessage(error, "Error confirming eSewa payment"));
  }
};

export const useConfirmEsewaPayment = () => {
  const queryClient = useQueryClient();

  return useMutation<EsewaConfirmResponse, Error, ConfirmEsewaPaymentInput>({
    mutationFn: confirmEsewaPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["studentFeeSummary"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

const markEsewaPaymentFailed = async (data: MarkEsewaFailedInput) => {
  try {
    const response = await axiosInstance.post(
      "/api/student/fees/esewa/failure",
      data
    );
    return response.data;
  } catch (error: any) {
    throw new Error(getErrorMessage(error, "Error updating failed payment"));
  }
};

export const useMarkEsewaPaymentFailed = () => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, MarkEsewaFailedInput>({
    mutationFn: markEsewaPaymentFailed,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["studentFeeSummary"] });
    },
  });
};
