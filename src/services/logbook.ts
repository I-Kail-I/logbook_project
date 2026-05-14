import api, { API_HEADERS } from "./api";
import {
  Logbook,
  LogbookFormData,
  CreateLogbookResponse,
  GetLogbookResponse,
  GetTupoksiResponse,
  Tupoksi,
  Statistics,
} from "./types";
import storage from "./storage";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export const logbook = {
  async getLogbook(nip?: string): Promise<GetLogbookResponse> {
    try {
      const userNip = nip || (await storage.getNip());
      if (!userNip) {
        return { success: false, message: "User not logged in" };
      }

      const response = await api.get<GetLogbookResponse>("/api-get-logbooksss", {
        params: { nip: userNip },
        headers: API_HEADERS,
      });

      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch logbooks",
      };
    }
  },

  async getTupoksi(nip?: string): Promise<GetTupoksiResponse> {
    try {
      const userNip = nip || (await storage.getNip());
      if (!userNip) {
        return { success: false, message: "User not logged in" };
      }

      const response = await api.get<GetTupoksiResponse>("/api-get-tupoksisss", {
        params: { nip: userNip },
        headers: API_HEADERS,
      });

      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch tupoksi",
      };
    }
  },

  async createLogbook(data: LogbookFormData): Promise<CreateLogbookResponse> {
    try {
      const formData = new FormData();
      formData.append("nip", data.nip);
      
      if (data.idLogbook) {
        formData.append("idLogbook", data.idLogbook);
      }
      
      formData.append("tupoksiDdl", data.tupoksiDdl);
      formData.append("deskripsiPekerjaan", data.deskripsiPekerjaan);
      formData.append("aktifitas", data.aktifitas);
      formData.append("tanggal", data.tanggal);
      
      if (data.linkDokumen) {
        formData.append("linkDokumen", data.linkDokumen);
      }

      if (data.fileDokumenLogbook) {
        const file = data.fileDokumenLogbook;
        const fileSize = parseInt(file.type || "0", 10);
        
        if (fileSize > MAX_FILE_SIZE) {
          return {
            success: false,
            message: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`,
          };
        }

        formData.append("fileDokumenLogbook", {
          uri: file.uri,
          name: file.name,
          type: file.type || "application/octet-stream",
        } as any);
      }

      const response = await api.post<CreateLogbookResponse>("/api-store-logbooksss", formData, {
        headers: {
          ...API_HEADERS,
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to create logbook",
      };
    }
  },

  calculateStatistics(logbooks: Logbook[]): Statistics {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    
    const thisMonthLogbooks = logbooks.filter((log) => {
      const logDate = new Date(log.tanggal.split("-").reverse().join("-"));
      return logDate.getMonth() === thisMonth && logDate.getFullYear() === thisYear;
    });

    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const weeklyLogbooks = logbooks.filter((log) => {
      const logDate = new Date(log.tanggal.split("-").reverse().join("-"));
      return logDate >= last7Days;
    });

    const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
    const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
    
    const weeklyData = dayNames.map((day, index) => {
      const count = weeklyLogbooks.filter((log) => {
        const logDate = new Date(log.tanggal.split("-").reverse().join("-"));
        return logDate.getDay() === index;
      }).length;
      return { day, count };
    });

    const weeksInMonth = ["W1", "W2", "W3", "W4"];
    const monthlyData = weeksInMonth.map((week) => {
      const weekIndex = weeksInMonth.indexOf(week);
      const startDay = weekIndex * 7 + 1;
      const endDay = startDay + 6;
      
      const count = thisMonthLogbooks.filter((log) => {
        const logDate = new Date(log.tanggal.split("-").reverse().join("-"));
        const day = logDate.getDate();
        return day >= startDay && day <= endDay;
      }).length;
      
      return { week, count };
    });

    const byStatus = {
      completed: logbooks.filter((l) => l.status === "completed").length,
      inProgress: logbooks.filter((l) => l.status === "in_progress").length,
      pending: logbooks.filter((l) => l.status === "pending").length,
    };

    const byCategory: Record<string, number> = {};
    logbooks.forEach((log) => {
      const category = log.tupoksiDdl || "Other";
      byCategory[category] = (byCategory[category] || 0) + 1;
    });

    const daysInMonth = new Date(thisYear, thisMonth + 1, 0).getDate();
    const daysPassed = now.getDate();
    const avgPerDay = daysPassed > 0 ? (thisMonthLogbooks.length / daysPassed).toFixed(1) : "0";

    return {
      totalLogbook: logbooks.length,
      thisMonth: thisMonthLogbooks.length,
      avgPerDay: parseFloat(avgPerDay),
      totalHours: logbooks.length * 2,
      weeklyData,
      monthlyData,
      byStatus,
      byCategory,
    };
  },
};

export default logbook;