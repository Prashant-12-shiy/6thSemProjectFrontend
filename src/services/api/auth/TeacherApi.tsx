// "use client"
import axiosInstance from "@/services/axiosInstance";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface TeacherLoginData {
  name: string;
  email: string;
  password: string;
  role: string;
  course: string;
  classInCharge: string;
}

const createTeacher = async (data: TeacherLoginData) => {
  try {
    const response = await axiosInstance.post(
      "/api/superadmin/createTeacher",
      data
    );

    return response.data;
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || "An error occurred";
    throw new Error(errorMessage);
  }
};

export const useCreateTeacher = () => {
  const queryclient = useQueryClient();
  const mutation = useMutation({
    mutationFn: createTeacher,
    onSuccess: (data) => {
      toast.success(data.message);
      queryclient.invalidateQueries({ queryKey: ["getAllTeacher"] });
    },
    onError: (error) => {
      console.log(error);

      toast.error(error.message);
    },
  });

  return mutation;
};

interface Course {
  _id: string;
  name: string;
  code: string;
}

interface ClassInCharge {
  _id: string;
  name: string;
}

export interface Teacher {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  course: Course;
  classInCharge: ClassInCharge;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const getAllTeacher = async () => {
  try {
    const response = await axiosInstance.get("/api/superadmin/getAllTeacher");

    return response.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const useGetAllTeacher = () => {
  return useQuery<Teacher[]>({
    queryKey: ["getAllTeacher"],
    queryFn: getAllTeacher,
  });
};

export interface UpdateTeacher {
  name: string;
  email: string;
  password: string;
  role: string;
  course: string;
  classInCharge: string;
}

const updateTeacher = async ({
  id,
  data,
}: {
  id: string;
  data: UpdateTeacher;
}) => {
  try {
    console.log(data);

    const response = await axiosInstance.post(
      `/api/superadmin/updateTeacher/${id}`,
      data
    );

    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data.message || "An error Occured");
  }
};

export const useUpdateTeacher = () => {
  const queryclient = useQueryClient();
  const mutation = useMutation({
    mutationFn: updateTeacher,
    onSuccess: () => {
      queryclient.invalidateQueries({ queryKey: ["getAllTeacher"] });
      toast.success("Teacher Updated");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return mutation;
};

const getMyDetails = async () => {
    try {
        const response = await axiosInstance.get("/api/teacher/getMyDetails");

        return response.data.data;
    } catch (error: any) {
        throw new Error(error.response.data.message || "An error Occured");
    }
}


export const useGetMyDetails = () => {
    return useQuery({
      queryKey: ["getmydetails"],
      queryFn: getMyDetails,
    });
  };

const getClassStudent = async () => {
  try {
    const response = await axiosInstance.get("/api/teacher/class/students");

    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data.message || "An error Occured");
  }
};

export const useGetClassStudent = () => {
  return useQuery({
    queryKey: ["getClassStudent"],
    queryFn: getClassStudent,
  });
};

const getStudentById = async (id: string) => {
  try {
    const response = await axiosInstance.get("/api/teacher/students/" + id);

    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data.message || "An error Occured");
  }
};

export const useGetStudentById = (id: string) => {
  return useQuery({
    queryKey: ["getStudentById", id],
    queryFn: () => getStudentById(id),
    enabled: Boolean(id),
  });
};

const markAttendence = async (data: any) => {
  try {
    const response = await axiosInstance.post(
      "/api/teacher/class/attendance",
      data
    );

    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data.message || "An error Occured");
  }
};

export const useMarkAttendence = () => {
  const queryclient = useQueryClient();
  const mutation = useMutation({
    mutationFn: markAttendence,
    onSuccess: (data) => {
      queryclient.invalidateQueries({ queryKey: ["getClassStudent"] });
    
      
      toast.success(
        data.studentName +
          " has been marked as " +
          data.attendance.status
      );
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return mutation;
};

const getAssignedTask = async () => {
  try {
    const response = await axiosInstance.get("/api/teacher/assignedTask");

    return response.data.task;
  } catch (error: any) {
    throw new Error(error.response.data.message || "An error Occured");
  }
};

export const useGetAssignedTask = () => {
  return useQuery({
    queryKey: ["getAssignedTask"],
    queryFn: getAssignedTask,
  });
};

export interface Task {
  assignedTo: string;
  taskContent: string;
}

const addTask = async (data: Task) => {
  try {
    const response = await axiosInstance.post("/api/teacher/addTask", data);

    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data.message || "An error Occured");
  }
};

export const useAddTask = () => {
  const queryclient = useQueryClient();
  const mutation = useMutation({
    mutationFn: addTask,
    onSuccess: (data) => {
      queryclient.invalidateQueries({ queryKey: ["getAssignedTask"] });
      toast.success("New Task Added");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return mutation;
};

const getStudentGrade = async (id: string) => {
  try {
    const response = await axiosInstance.get(
      "/api/teacher/getStudentGrade/" + id
    );

    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data.message || "An error Occured");
  }
};

export const useGetStudentGrade = (id: string) => {
  return useQuery({
    queryKey: ["getStudentGrade", id],
    queryFn: () => getStudentGrade(id),
    enabled: Boolean(id),
  });
};

export interface Grade {
    studentName: string,
    courseName: string,
    term: string,
    grade: string,
    mark: number,
    remarks: string
}

const addGrade = async (data:Grade) => {
  try {
    const response = await axiosInstance.post("/api/teacher/addGrade", data);

    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data.message || "An error Occured");
  }
};

export const useAddGrade = () => {
    const queryclient = useQueryClient();
    const mutation = useMutation({
        mutationFn: addGrade,
        onSuccess: () => {
            toast.success("Grade Added ");
            queryclient.invalidateQueries({queryKey: ["getStudentById"]})
        },
        onError: (error) => {
            toast.error(error.message);
        }
    })
    return mutation
}


const updateGrade = async (data: any) => {
    try {
      const response = await axiosInstance.patch("/api/teacher/updateGrade", data);
  
      return response.data;
    } catch (error: any) {
      throw new Error(error.response.data.message || "An error Occured");
    }
  };
  
  export const useUpdateGrade = () => {
      const queryclient = useQueryClient();
      const mutation = useMutation({
          mutationFn: updateGrade,
          onSuccess: () => {
              toast.success("Grade Updated ");
              queryclient.invalidateQueries({queryKey: ["getStudentById"]})
          },
          onError: (error) => {
              toast.error(error.message);
          }
      })
      return mutation
  }

const getTeacherClasses = async () => {
  try {
    const response = await axiosInstance.get("/api/teacher/classes");
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error fetching classes");
  }
};

export const useGetTeacherClasses = () => {
  return useQuery({
    queryKey: ["teacherClasses"],
    queryFn: getTeacherClasses,
  });
};