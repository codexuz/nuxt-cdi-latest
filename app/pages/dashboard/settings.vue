<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
      <p class="text-gray-600 dark:text-gray-400 mt-2">
        Manage your learning center preferences and configuration
      </p>
    </div>

    <!-- Settings Navigation -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- Sidebar Navigation -->
      <Card class="lg:col-span-1">
        <CardContent class="p-4">
          <nav class="space-y-2">
            <Button
              v-for="section in settingsSections"
              :key="section.id"
              @click="activeSection = section.id"
              :variant="activeSection === section.id ? 'default' : 'ghost'"
              class="w-full justify-start"
            >
              <component :is="section.icon" class="h-4 w-4 mr-2" />
              {{ section.name }}
            </Button>
          </nav>
        </CardContent>
      </Card>

      <!-- Settings Content -->
      <div class="lg:col-span-3">
        <!-- General Settings -->
        <Card v-if="activeSection === 'general'">
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>
              Basic information about your learning center
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <Label for="center-name">Center Name</Label>
                <Input 
                  id="center-name" 
                  v-model="settings.general.centerName"
                  placeholder="Your Learning Center Name"
                />
              </div>
              
              <div class="space-y-2">
                <Label for="center-email">Contact Email</Label>
                <Input 
                  id="center-email" 
                  type="email"
                  v-model="settings.general.contactEmail"
                  placeholder="contact@example.com"
                />
              </div>
              
              <div class="space-y-2">
                <Label for="center-phone">Phone Number</Label>
                <Input 
                  id="center-phone" 
                  v-model="settings.general.phone"
                  placeholder="+1234567890"
                />
              </div>
              
              <div class="space-y-2">
                <Label for="timezone">Timezone</Label>
                <Select v-model="settings.general.timezone">
                  <SelectTrigger>
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="America/New_York">Eastern Time</SelectItem>
                    <SelectItem value="America/Chicago">Central Time</SelectItem>
                    <SelectItem value="America/Denver">Mountain Time</SelectItem>
                    <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div class="space-y-2">
              <Label for="center-address">Address</Label>
              <Textarea 
                id="center-address" 
                v-model="settings.general.address"
                placeholder="123 Main Street, City, State, Country"
                rows="3"
              />
            </div>
            
            <Button @click="saveGeneralSettings">Save General Settings</Button>
          </CardContent>
        </Card>

        <!-- Test Settings -->
        <Card v-if="activeSection === 'tests'">
          <CardHeader>
            <CardTitle>Test Settings</CardTitle>
            <CardDescription>
              Configure default test behavior and scoring
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-6">
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div class="space-y-0.5">
                  <Label>Auto-submit tests</Label>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    Automatically submit tests when time expires
                  </p>
                </div>
                <Switch 
                  v-model="settings.tests.autoSubmit"
                  :checked="settings.tests.autoSubmit"
                />
              </div>
              
              <div class="flex items-center justify-between">
                <div class="space-y-0.5">
                  <Label>Show answers after completion</Label>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    Display correct answers to students after test completion
                  </p>
                </div>
                <Switch 
                  v-model="settings.tests.showAnswers"
                  :checked="settings.tests.showAnswers"
                />
              </div>
              
              <div class="flex items-center justify-between">
                <div class="space-y-0.5">
                  <Label>Allow test retakes</Label>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    Allow students to retake tests multiple times
                  </p>
                </div>
                <Switch 
                  v-model="settings.tests.allowRetakes"
                  :checked="settings.tests.allowRetakes"
                />
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-2">
                  <Label for="default-duration">Default Test Duration (minutes)</Label>
                  <Input 
                    id="default-duration" 
                    type="number"
                    v-model="settings.tests.defaultDuration"
                    min="1"
                    max="300"
                  />
                </div>
                
                <div class="space-y-2">
                  <Label for="passing-score">Passing Score (%)</Label>
                  <Input 
                    id="passing-score" 
                    type="number"
                    v-model="settings.tests.passingScore"
                    min="0"
                    max="100"
                  />
                </div>
              </div>
            </div>
            
            <Button @click="saveTestSettings">Save Test Settings</Button>
          </CardContent>
        </Card>

        <!-- Notification Settings -->
        <Card v-if="activeSection === 'notifications'">
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
            <CardDescription>
              Manage email and in-app notification preferences
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-6">
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div class="space-y-0.5">
                  <Label>Email notifications</Label>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    Receive important updates via email
                  </p>
                </div>
                <Switch 
                  v-model="settings.notifications.email"
                  :checked="settings.notifications.email"
                />
              </div>
              
              <div class="flex items-center justify-between">
                <div class="space-y-0.5">
                  <Label>Student registration alerts</Label>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    Get notified when new students register
                  </p>
                </div>
                <Switch 
                  v-model="settings.notifications.studentRegistration"
                  :checked="settings.notifications.studentRegistration"
                />
              </div>
              
              <div class="flex items-center justify-between">
                <div class="space-y-0.5">
                  <Label>Test completion alerts</Label>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    Get notified when students complete tests
                  </p>
                </div>
                <Switch 
                  v-model="settings.notifications.testCompletion"
                  :checked="settings.notifications.testCompletion"
                />
              </div>
              
              <div class="flex items-center justify-between">
                <div class="space-y-0.5">
                  <Label>Weekly reports</Label>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    Receive weekly performance summaries
                  </p>
                </div>
                <Switch 
                  v-model="settings.notifications.weeklyReports"
                  :checked="settings.notifications.weeklyReports"
                />
              </div>
            </div>
            
            <Button @click="saveNotificationSettings">Save Notification Settings</Button>
          </CardContent>
        </Card>

        <!-- Security Settings -->
        <Card v-if="activeSection === 'security'">
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
            <CardDescription>
              Manage your account security and privacy
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-6">
            <div class="space-y-4">
              <div class="space-y-2">
                <Label for="current-password">Current Password</Label>
                <Input 
                  id="current-password" 
                  type="password"
                  v-model="passwordForm.currentPassword"
                  placeholder="Enter current password"
                />
              </div>
              
              <div class="space-y-2">
                <Label for="new-password">New Password</Label>
                <Input 
                  id="new-password" 
                  type="password"
                  v-model="passwordForm.newPassword"
                  placeholder="Enter new password"
                />
              </div>
              
              <div class="space-y-2">
                <Label for="confirm-password">Confirm New Password</Label>
                <Input 
                  id="confirm-password" 
                  type="password"
                  v-model="passwordForm.confirmPassword"
                  placeholder="Confirm new password"
                />
              </div>
              
              <Button @click="changePassword">Change Password</Button>
            </div>
            
            <Separator />
            
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div class="space-y-0.5">
                  <Label>Two-factor authentication</Label>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <Button variant="outline">Enable 2FA</Button>
              </div>
              
              <div class="flex items-center justify-between">
                <div class="space-y-0.5">
                  <Label>Session timeout</Label>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    Automatically log out after inactivity
                  </p>
                </div>
                <Select v-model="settings.security.sessionTimeout">
                  <SelectTrigger class="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 min</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                    <SelectItem value="480">8 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Billing Settings -->
        <Card v-if="activeSection === 'billing'">
          <CardHeader>
            <CardTitle>Billing & Subscription</CardTitle>
            <CardDescription>
              Manage your subscription and payment methods
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-6">
            <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="font-medium text-blue-900 dark:text-blue-100">Professional Plan</h4>
                  <p class="text-sm text-blue-700 dark:text-blue-300">$79/month • Renews on Dec 15, 2025</p>
                </div>
                <Badge>Active</Badge>
              </div>
            </div>
            
            <div class="space-y-4">
              <Button variant="outline" @click="navigateTo('/subscriptions')">
                Change Plan
              </Button>
              <Button variant="outline">
                Update Payment Method
              </Button>
              <Button variant="outline">
                Download Invoices
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  Settings as SettingsIcon,
  FileText,
  Bell,
  Shield,
  CreditCard
} from "lucide-vue-next";

import { toast } from "vue-sonner";

useHead({
  title: "Settings - Testify",
});

const activeSection = ref('general');

const settingsSections = [
  { id: 'general', name: 'General', icon: SettingsIcon },
  { id: 'tests', name: 'Tests', icon: FileText },
  { id: 'notifications', name: 'Notifications', icon: Bell },
  { id: 'security', name: 'Security', icon: Shield },
  { id: 'billing', name: 'Billing', icon: CreditCard }
];

const settings = ref({
  general: {
    centerName: 'IELTS Excellence Center',
    contactEmail: 'contact@ieltsexcellence.com',
    phone: '+1 (555) 123-4567',
    address: '123 Education Street\nNew York, NY 10001',
    timezone: 'America/New_York'
  },
  tests: {
    autoSubmit: true,
    showAnswers: true,
    allowRetakes: false,
    defaultDuration: 60,
    passingScore: 70
  },
  notifications: {
    email: true,
    studentRegistration: true,
    testCompletion: true,
    weeklyReports: false
  },
  security: {
    sessionTimeout: '60'
  }
});

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

const saveGeneralSettings = () => {
  // TODO: Implement API call
  toast.success('General settings saved successfully!');
};

const saveTestSettings = () => {
  // TODO: Implement API call
  toast.success('Test settings saved successfully!');
};

const saveNotificationSettings = () => {
  // TODO: Implement API call
  toast.success('Notification settings saved successfully!');
};

const changePassword = () => {
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    toast.error('Passwords do not match!');
    return;
  }
  
  // TODO: Implement password change API call
  toast.success('Password changed successfully!');
  
  // Clear form
  passwordForm.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };
};

definePageMeta({
  layout: "dashboard",
  middleware: "auth",
});
</script>