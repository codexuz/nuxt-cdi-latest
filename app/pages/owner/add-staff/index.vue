<template>
  <motion.div 
    class="space-y-6"
    :initial="{ opacity: 0, y: 20 }"
    :transition="{ duration: 0.6, ease: 'easeOut' }"
    :animate="{ opacity: 1, y: 0 }">
    <!-- Header -->
    <motion.div
      class="flex items-center justify-between"
      :initial="{ opacity: 0, y: -10 }"
      :transition="{ duration: 0.5, delay: 0.1 }"
      :animate="{ opacity: 1, y: 0 }">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Staff Management</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-2">Manage all staff members and their roles</p>
      </div>
      <Button @click="openCreateModal">
        <UserPlus class="h-4 w-4 mr-2" />
        Add Staff Member
      </Button>
    </motion.div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>

    <!-- Admin Users List -->
    <motion.div
      v-else
      :initial="{ opacity: 0, y: 20 }"
      :transition="{ duration: 0.5, delay: 0.2 }"
      :animate="{ opacity: 1, y: 0 }">
      <Card>
        <CardHeader>
          <CardTitle>All Staff Members</CardTitle>
          <CardDescription>List of all staff members ({{ adminUsers.length }} total)</CardDescription>
        </CardHeader>
        <CardContent>
          <div v-if="adminUsers.length === 0" class="text-center py-8 text-gray-500">
            No staff members found. Add your first staff member to get started.
          </div>
          <div v-else class="space-y-3">
            <div 
              v-for="user in adminUsers" 
              :key="user.id"
              class="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <div class="flex items-center space-x-4">
                <Avatar class="h-10 w-10">
                  <AvatarImage v-if="user.avatar" :src="user.avatar" :alt="user.name" />
                  <AvatarFallback>{{ getInitials(user.name) }}</AvatarFallback>
                </Avatar>
                <div>
                  <p class="font-medium">{{ user.name }}</p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">{{ user.email }}</p>
                  <p class="text-xs text-gray-500">{{ user.phone }}</p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <Badge v-for="role in user.roles" :key="role">{{ role?.role_name }}</Badge>
                <Button size="sm" variant="ghost" @click="openEditModal(user)">
                  <Pencil class="h-4 w-4 text-blue-600" />
                </Button>
                <Button size="sm" variant="ghost" @click="confirmDelete(user)">
                  <Trash2 class="h-4 w-4 text-red-600" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>

    <!-- Create Staff Modal -->
    <Dialog v-model:open="isCreateModalOpen">
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Staff Member</DialogTitle>
          <DialogDescription>
            Create a new staff member with specific role and permissions.
          </DialogDescription>
        </DialogHeader>

        <form @submit.prevent="createStaff" class="space-y-4">
          <div class="space-y-2">
            <Label for="name">Full Name</Label>
            <Input
              id="name"
              v-model="staffData.name"
              placeholder="John Doe"
              required
            />
          </div>

          <div class="space-y-2">
            <Label for="email">Email Address</Label>
            <Input
              id="email"
              v-model="staffData.email"
              type="email"
              placeholder="user@example.com"
              required
            />
          </div>

          <div class="space-y-2">
            <Label for="phone">Phone Number</Label>
            <Input
              id="phone"
              v-model="staffData.phone"
              type="tel"
              placeholder="+1234567890"
              required
            />
          </div>

          <div class="space-y-2">
            <Label for="password">Password</Label>
            <Input
              id="password"
              v-model="staffData.password"
              type="password"
              placeholder="••••••••"
              required
              minlength="6"
            />
          </div>

          <div class="space-y-2">
            <Label for="role">Role</Label>
            <Select v-model="staffData.role">
              <SelectTrigger id="role">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="teacher">Teacher</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter class="gap-2 sm:gap-0">{
            <Button
              type="button"
              variant="outline"
              @click="closeCreateModal"
              :disabled="isCreating"
            >
              Cancel
            </Button>
            <Button type="submit" :disabled="isCreating">
              <span v-if="isCreating" class="flex items-center">
                <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating...
              </span>
              <span v-else>Create Staff</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>

    <!-- Edit Staff Modal -->
    <Dialog v-model:open="isEditModalOpen">
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Staff Member</DialogTitle>
          <DialogDescription>
            Update staff member information and role.
          </DialogDescription>
        </DialogHeader>

        <form @submit.prevent="updateStaff" class="space-y-4">
          <div class="space-y-2">
            <Label for="edit-name">Full Name</Label>
            <Input
              id="edit-name"
              v-model="editStaffData.name"
              placeholder="John Doe"
              required
            />
          </div>

          <div class="space-y-2">
            <Label for="edit-email">Email Address</Label>
            <Input
              id="edit-email"
              v-model="editStaffData.email"
              type="email"
              placeholder="user@example.com"
              required
            />
          </div>

          <div class="space-y-2">
            <Label for="edit-phone">Phone Number</Label>
            <Input
              id="edit-phone"
              v-model="editStaffData.phone"
              type="tel"
              placeholder="+1234567890"
              required
            />
          </div>

          <div class="space-y-2">
            <Label for="edit-password">New Password (optional)</Label>
            <Input
              id="edit-password"
              v-model="editStaffData.password"
              type="password"
              placeholder="Leave blank to keep current"
              minlength="6"
            />
          </div>

          <DialogFooter class="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              @click="closeEditModal"
              :disabled="isUpdating"
            >
              Cancel
            </Button>
            <Button type="submit" :disabled="isUpdating">
              <span v-if="isUpdating" class="flex items-center">
                <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Updating...
              </span>
              <span v-else>Update Staff</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>

    <!-- Delete Confirmation Dialog -->
    <AlertDialog v-model:open="isDeleteDialogOpen">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the staff member
            <span class="font-semibold">{{ userToDelete?.name }}</span> and remove their access from the system.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel :disabled="isDeleting">Cancel</AlertDialogCancel>
          <AlertDialogAction
            @click="deleteUser"
            :disabled="isDeleting"
            class="bg-red-600 hover:bg-red-700"
          >
            <span v-if="isDeleting" class="flex items-center">
              <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Deleting...
            </span>
            <span v-else>Delete</span>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </motion.div>
</template>

<script setup>
import { motion } from "motion-v";
import { UserPlus, Trash2, Pencil } from "lucide-vue-next";
import { toast } from "vue-sonner";

useHead({
  title: "Add Staff - Dashboard",
});

// Get runtime config
const config = useRuntimeConfig();
const baseURL = config.public.baseURL;

// Get active center from composable
const { activeCenter } = useCenters();

const staffData = ref({
  name: "",
  email: "",
  phone: "",
  password: "",
  role: "admin"
});

const editStaffData = ref({
  id: null,
  name: "",
  email: "",
  phone: "",
  password: ""
});

const isLoading = ref(false);
const isCreating = ref(false);
const isUpdating = ref(false);
const isDeleting = ref(false);
const isCreateModalOpen = ref(false);
const isEditModalOpen = ref(false);
const isDeleteDialogOpen = ref(false);
const adminUsers = ref([]);
const userToDelete = ref(null);

// Fetch admin users
const fetchAdminUsers = async () => {
  if (!activeCenter.value?.id) return;

  isLoading.value = true;
  try {
    const authStore = useAuthStore();
    const token = authStore.token;

    const response = await fetch(`${baseURL}/users/staff?centerId=${activeCenter.value.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch admin users");
    }

    const data = await response.json();
    adminUsers.value = data;
  } catch (error) {
    console.error("Error fetching admin users:", error);
    toast.error("Failed to load admin users");
  } finally {
    isLoading.value = false;
  }
};

const createStaff = async () => {
  if (!activeCenter.value?.id) {
    toast.error("No center selected");
    return;
  }

  if (!staffData.value.role) {
    toast.error("Please select a role");
    return;
  }

  isCreating.value = true;
  try {
    const authStore = useAuthStore();
    const token = authStore.token;

    const response = await fetch(`${baseURL}/users`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: staffData.value.name,
        email: staffData.value.email,
        phone: staffData.value.phone,
        password: staffData.value.password,
        center_id: activeCenter.value.id,
        roles: [staffData.value.role]
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create staff member");
    }

    const data = await response.json();
    console.log("Staff created:", data);

    toast.success(`${staffData.value.role.charAt(0).toUpperCase() + staffData.value.role.slice(1)} created successfully!`);
    
    closeCreateModal();
    await fetchAdminUsers(); // Refresh the list
  } catch (error) {
    console.error("Error creating staff:", error);
    toast.error(error.message || "Failed to create staff member");
  } finally {
    isCreating.value = false;
  }
};

const openCreateModal = () => {
  isCreateModalOpen.value = true;
};

const closeCreateModal = () => {
  isCreateModalOpen.value = false;
  staffData.value = {
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "admin"
  };
};

const openEditModal = (user) => {
  editStaffData.value = {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    password: ""
  };
  isEditModalOpen.value = true;
};

const closeEditModal = () => {
  isEditModalOpen.value = false;
  editStaffData.value = {
    id: null,
    name: "",
    email: "",
    phone: "",
    password: ""
  };
};

const updateStaff = async () => {
  if (!editStaffData.value.id) {
    toast.error("No user selected");
    return;
  }

  isUpdating.value = true;
  try {
    const authStore = useAuthStore();
    const token = authStore.token;

    const payload = {
      name: editStaffData.value.name,
      email: editStaffData.value.email,
      phone: editStaffData.value.phone
    };

    // Only include password if it's provided
    if (editStaffData.value.password) {
      payload.password = editStaffData.value.password;
    }

    const response = await fetch(`${baseURL}/users/${editStaffData.value.id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update staff member");
    }

    const data = await response.json();
    console.log("Staff updated:", data);

    toast.success("Staff member updated successfully!");
    
    closeEditModal();
    await fetchAdminUsers(); // Refresh the list
  } catch (error) {
    console.error("Error updating staff:", error);
    toast.error(error.message || "Failed to update staff member");
  } finally {
    isUpdating.value = false;
  }
};

const confirmDelete = (user) => {
  userToDelete.value = user;
  isDeleteDialogOpen.value = true;
};

const deleteUser = async () => {
  if (!userToDelete.value?.id) return;

  isDeleting.value = true;
  try {
    const authStore = useAuthStore();
    const token = authStore.token;

    const response = await fetch(`${baseURL}/users/${userToDelete.value.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete user");
    }

    toast.success(`${userToDelete.value.name} has been deleted successfully`);
    
    isDeleteDialogOpen.value = false;
    userToDelete.value = null;
    await fetchAdminUsers(); // Refresh the list
  } catch (error) {
    console.error("Error deleting user:", error);
    toast.error(error.message || "Failed to delete user");
  } finally {
    isDeleting.value = false;
  }
};

const getInitials = (name) => {
  if (!name) return "U";
  const parts = name.split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

// Fetch admin users on mount
onMounted(() => {
  fetchAdminUsers();
});

// Watch for center changes
watch(
  () => activeCenter.value?.id,
  () => {
    if (activeCenter.value?.id) {
      fetchAdminUsers();
    }
  }
);

definePageMeta({
  layout: "dashboard",
  middleware: ["auth"],
});
</script>
