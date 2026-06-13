const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Helper to get auth headers
const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem("authToken");
  const headers: Record<string, string> = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  async signup(data: any) {
    const response = await fetch(`${API_BASE_URL}/postoreApi/credentials/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Signup failed");
    const result = await response.json();
    console.log("Signup result:", result);
    // Store token if returned
    if (result.token) {
      localStorage.setItem("authToken", result.token);
    } else if (result.accessToken) {
      localStorage.setItem("authToken", result.accessToken);
    } else {
      // Check if token is somewhere else
      console.log("No token found in signup response, keys:", Object.keys(result));
    }
    return result;
  },

  async login(data: any) {
    const response = await fetch(`${API_BASE_URL}/postoreApi/credentials/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Login failed");
    const result = await response.json();
    console.log("Login result:", result);
    // Store token
    if (result.token) {
      localStorage.setItem("authToken", result.token);
    } else if (result.accessToken) {
      localStorage.setItem("authToken", result.accessToken);
    } else {
      // Check if token is somewhere else
      console.log("No token found in login response, keys:", Object.keys(result));
    }
    return result;
  },

  async logout() {
    // Optional: call logout endpoint if needed
    try {
      await fetch(`${API_BASE_URL}/postoreApi/credentials/logout`, {
        method: "POST",
        headers: getAuthHeaders(),
      });
    } catch (e) {
      // Ignore errors on logout
    }
    // Clear token from localStorage
    localStorage.removeItem("authToken");
  },

  async getMe() {
    const response = await fetch(`${API_BASE_URL}/postoreApi/credentials/me`, {
      headers: getAuthHeaders(),
    });
    console.log("getMe response status:", response.status);
    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem("authToken");
      }
      throw new Error("Failed to get user");
    }
    const data = await response.json();
    console.log("getMe response data:", data);
    return data;
  },

  async getAllBusinessStatuses() {
    const response = await fetch(`${API_BASE_URL}/postoreApi/business/getAllBusinesses`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem("authToken");
      }
      throw new Error("Failed to get business statuses");
    }
    return response.json();
  },

  async createBusinessStatus(data: any) {
    const response = await fetch(`${API_BASE_URL}/postoreApi/business/createBusiness`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem("authToken");
      }
      throw new Error("Failed to create business status");
    }
    return response;
  },

  async updateBusinessStatus(idBusiness: number | string, data: any) {
    const response = await fetch(`${API_BASE_URL}/postoreApi/business/updateBusiness/${idBusiness}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem("authToken");
      }
      throw new Error("Failed to update business status");
    }
    return response;
  },

  async checkBusinessStatus(idBusiness: number | string) {
    const response = await fetch(`${API_BASE_URL}/postoreApi/business/checkStatus?idBusiness=${idBusiness}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem("authToken");
      }
      throw new Error("Failed to check business status");
    }
    return response.json();
  },

  async getBusinessStatusById(idBusiness: number | string) {
    const response = await fetch(`${API_BASE_URL}/postoreApi/business/getBusinessStatusById/${idBusiness}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem("authToken");
      }
      throw new Error("Failed to get business status by id");
    }
    return response.json();
  },

  async uploadImage(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch(`${API_BASE_URL}/postoreApi/business/uploadImage`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: formData,
    });
    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem("authToken");
      }
      throw new Error("Failed to upload image");
    }
    const data = await response.json();
    console.log("uploadImage response data:", data);
    return data;
  },

  async deleteImage(id: number | string) {
    const response = await fetch(`${API_BASE_URL}/postoreApi/business/deleteImage/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem("authToken");
      }
      throw new Error("Failed to delete image");
    }
    return response;
  },

  async updateImage(id: number, file: File) {
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch(`${API_BASE_URL}/postoreApi/business/updateImage/${id}`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: formData,
    });
    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem("authToken");
      }
      throw new Error("Failed to update image");
    }
    // Parse JSON response
    const data = await response.json();
    console.log("updateImage response data:", data);
    return data;
  },
  async deleteBusinessStatus(id: number | string) {
    const response = await fetch(`${API_BASE_URL}/postoreApi/business/deleteBusiness/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem("authToken");
      }
      throw new Error("Failed to delete business status");
    }
    return response;
  },
};
