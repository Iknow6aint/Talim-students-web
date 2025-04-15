import { API_BASE_URL } from "@/lib/constants";

// services/attendance.service.ts
export const attendanceService = {
    getDashboard: async (schoolId: string, accessToken: string) => {
      try {
        const response = await fetch(`${API_BASE_URL}/attendance/dashboard/${schoolId}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          }
        });
  
        console.log('API Response status:', response.status);
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error('API Error response:', errorData);
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        console.log('API Success response:', data);
        return data;
      } catch (error) {
        console.error('Network error:', error);
        throw error;
      }
    }
  };