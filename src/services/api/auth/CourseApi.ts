import axiosInstance from "@/services/axiosInstance";
import { useMutation, useQuery } from "@tanstack/react-query";

const getAllCourse = async () => {
  try {
    const response = await axiosInstance.get("/api/superadmin/getAllCourse");

    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data.data || "Error Fetching Couse Data");
  }
};

export const useGetAllCourse = () => {
  return useQuery({
    queryKey: ["getAllCourse"],
    queryFn: getAllCourse,
  });
};

const getCourseBySuperAdmin = async (id: string) => {
  try {
    const response = await axiosInstance.get("/api/superadmin/getCourse/" + id);

    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data.data || "Error Fetching Couse Data");
  }
};

export const useGetCourseBySuperAdmin = (id: string) => {
  return useQuery({
    queryKey: ["getCourse"],
    queryFn: () => getCourseBySuperAdmin(id),
  });
};

interface Course {
  name: string;
  code: string;
  description: string;
  credits: number;
  className: string;
}

export interface CoursesResponse {
  courses: Course[];
}

const createCourse = async (data: CoursesResponse) => {
  try {
    const response = await axiosInstance.post(
      "/api/superadmin/createCourses",
      data
    );

    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data.data || "Error Creating Course Data");
  }
};

export const useCreateCourse = () => {
  const mutation = useMutation({
    mutationFn: createCourse,
  });

  return mutation;
};



interface UpdateCourseInput {
  updatedData: {
    name?: string;
    code?: string;
    description?: string;
    credits?: number;
    className?: string;
  };
  id: string;
}

const updateCourse = async ({ updatedData, id }: UpdateCourseInput) => {
  try {
    const response = await axiosInstance.patch(
      `/api/superadmin/updateCourse/${id}`,
      updatedData
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data.data || "Error Updating Course Data");
  }
};

export const useUpdateCourse = () => {
  const mutation = useMutation({
    mutationFn: updateCourse,
  });

  return mutation;
};
