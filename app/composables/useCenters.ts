// composables/useCenters.ts
import { useCookie } from "#app";
import { createError } from "h3";

const useApiBaseUrl = () => {
  const config = useRuntimeConfig();
  return config.public.baseURL as string;
};

export interface Center {
  id: string;
  name: string;
  subdomain: string;
  address: string;
  owner_id: string;
  phone: string;
  email: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Fetch centers owned by the authenticated user
 */
export async function getMyCenters(): Promise<Center[]> {
  const API_BASE_URL = useApiBaseUrl();
  const tokenCookie = useCookie<string | null>("access_token", {
    default: () => null,
  });

  if (!tokenCookie.value) {
    throw createError({
      statusCode: 401,
      statusMessage: "Not authenticated",
    });
  }

  try {
    const data = await $fetch<Center[]>(`${API_BASE_URL}/centers/my-centers`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${tokenCookie.value}`,
      },
    });

    return data;
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || "Failed to fetch centers",
    });
  }
}

/**
 * Get the first active center for the user
 */
export async function getActiveCenter(): Promise<Center | null> {
  try {
    const centers = await getMyCenters();
    return centers.find((center) => center.is_active) || centers[0] || null;
  } catch (error) {
    console.error("Failed to get active center:", error);
    return null;
  }
}

/**
 * Composable for managing centers
 */
export const useCenters = () => {
  const centers = useState<Center[]>("user.centers", () => []);
  const activeCenter = useState<Center | null>("user.activeCenter", () => null);

  const fetchMyCenters = async () => {
    try {
      const data = await getMyCenters();
      centers.value = data;

      // Set active center if not already set
      if (!activeCenter.value && data.length > 0) {
        activeCenter.value = data.find((c) => c.is_active) || data[0] || null;
      }

      return data;
    } catch (error) {
      console.error("Failed to fetch centers:", error);
      throw error;
    }
  };

  const setActiveCenter = (center: Center) => {
    activeCenter.value = center;
  };

  return {
    centers: readonly(centers),
    activeCenter: readonly(activeCenter),
    fetchMyCenters,
    setActiveCenter,
    getMyCenters,
    getActiveCenter,
  };
};
