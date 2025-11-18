// composables/useMedia.ts
import { toast } from "vue-sonner";

export interface MediaItem {
  id: string;
  filename: string;
  original_filename: string;
  file_path: string;
  url: string;
  mime_type: string;
  file_size: string;
  media_type: string;
  alt_text?: string;
  description?: string;
  width?: number | null;
  height?: number | null;
  duration?: number | null;
  center_id: string;
  center?: {
    id: string;
    name: string;
    subdomain: string;
    address: string;
    owner_id: string;
    phone: string;
    email: string;
    description?: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  };
  uploaded_by?: string | null;
  uploader?: any | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MediaListResponse {
  data: MediaItem[];
  total: number;
  page: number;
  limit: number;
}

export interface UploadMediaData {
  file: File;
  alt_text?: string;
  description?: string;
  center_id?: string;
}

export interface UpdateMediaData {
  alt_text?: string;
  description?: string;
}

export const useMedia = () => {
  const config = useRuntimeConfig();
  const API_BASE_URL = config.public.baseURL as string;
  const authStore = useAuthStore();

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${authStore.token}`,
  });

  // Upload single media
  const uploadMedia = async (data: UploadMediaData): Promise<MediaItem> => {
    try {
      const formData = new FormData();
      formData.append("file", data.file);

      if (data.alt_text) formData.append("alt_text", data.alt_text);
      if (data.description) formData.append("description", data.description);
      if (data.center_id) formData.append("center_id", data.center_id);

      const response = await $fetch<MediaItem>(`${API_BASE_URL}/media/upload`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: formData,
      });

      toast.success("Media uploaded successfully!");
      return response;
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.data?.message || "Failed to upload media");
      throw error;
    }
  };

  // Upload multiple media files
  const uploadMultipleMedia = async (
    files: File[],
    center_id?: string
  ): Promise<MediaItem[]> => {
    try {
      const formData = new FormData();

      files.forEach((file) => {
        formData.append("files", file);
      });

      if (center_id) formData.append("center_id", center_id);

      const response = await $fetch<MediaItem[]>(
        `${API_BASE_URL}/media/upload/multiple`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: formData,
        }
      );

      toast.success(`${files.length} files uploaded successfully!`);
      return response;
    } catch (error: any) {
      console.error("Multiple upload error:", error);
      toast.error(error.data?.message || "Failed to upload files");
      throw error;
    }
  };

  // Get all media
  const getAllMedia = async (params?: {
    center_id?: string;
    media_type?: "image" | "video" | "audio" | "document" | "other";
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<MediaListResponse> => {
    try {
      const response = await $fetch<MediaListResponse>(
        `${API_BASE_URL}/media`,
        {
          method: "GET",
          headers: getAuthHeaders(),
          params: params || {},
        }
      );

      return response;
    } catch (error: any) {
      console.error("Get all media error:", error);
      toast.error(error.data?.message || "Failed to fetch media");
      throw error;
    }
  };

  // Get media by type
  const getMediaByType = async (
    type: string,
    center_id?: string
  ): Promise<MediaItem[]> => {
    try {
      const queryParams = new URLSearchParams();
      if (center_id) queryParams.append("center_id", center_id);

      const queryString = queryParams.toString();
      const url = queryString
        ? `${API_BASE_URL}/media/type/${type}?${queryString}`
        : `${API_BASE_URL}/media/type/${type}`;

      const response = await $fetch<MediaItem[]>(url, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      return response;
    } catch (error: any) {
      console.error("Get media by type error:", error);
      toast.error(error.data?.message || "Failed to fetch media");
      throw error;
    }
  };

  // Get single media
  const getMediaById = async (id: string): Promise<MediaItem> => {
    try {
      const response = await $fetch<MediaItem>(`${API_BASE_URL}/media/${id}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      return response;
    } catch (error: any) {
      console.error("Get media error:", error);
      toast.error(error.data?.message || "Failed to fetch media");
      throw error;
    }
  };

  // Update media
  const updateMedia = async (
    id: string,
    data: UpdateMediaData
  ): Promise<MediaItem> => {
    try {
      const response = await $fetch<MediaItem>(`${API_BASE_URL}/media/${id}`, {
        method: "PATCH",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: data,
      });

      toast.success("Media updated successfully!");
      return response;
    } catch (error: any) {
      console.error("Update media error:", error);
      toast.error(error.data?.message || "Failed to update media");
      throw error;
    }
  };

  // Delete media
  const deleteMedia = async (id: string): Promise<void> => {
    try {
      await $fetch(`${API_BASE_URL}/media/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      toast.success("Media deleted successfully!");
    } catch (error: any) {
      console.error("Delete media error:", error);
      toast.error(error.data?.message || "Failed to delete media");
      throw error;
    }
  };

  // Helper to format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  // Helper to get file type category
  const getFileTypeCategory = (type: string): string => {
    if (type.startsWith("image/")) return "image";
    if (type.startsWith("video/")) return "video";
    if (type.startsWith("audio/")) return "audio";
    if (type.includes("pdf")) return "pdf";
    if (type.includes("word") || type.includes("document")) return "document";
    if (type.includes("sheet") || type.includes("excel")) return "spreadsheet";
    return "file";
  };

  return {
    uploadMedia,
    uploadMultipleMedia,
    getAllMedia,
    getMediaByType,
    getMediaById,
    updateMedia,
    deleteMedia,
    formatFileSize,
    getFileTypeCategory,
  };
};
