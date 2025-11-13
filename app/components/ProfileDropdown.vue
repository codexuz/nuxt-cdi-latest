<template>
     <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Avatar>
        <AvatarImage src="https://github.com/unovue.png" alt="@unovue" />
        <AvatarFallback>JK</AvatarFallback>
    </Avatar>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-56">
      <DropdownMenuLabel>{{ first_name }}</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem @click="() => router.push('/profile')">
          <User class="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem @click="() => router.push('/my-tests')">
          <NotebookPen class="mr-2 h-4 w-4" />
          <span>My Mock Tests</span>
        </DropdownMenuItem>
         <DropdownMenuItem @click="() => router.push('/billing-history')">
          <CreditCard class="mr-2 h-4 w-4" />
          <span>Billing History</span>
        </DropdownMenuItem>
      </DropdownMenuGroup>
    <DropdownMenuSeparator/>
      <DropdownMenuItem @click="logout" class="text-rose-500 font-bold">
        <LogOut class="mr-2 h-4 w-4" />
        <span>Log out</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>

</template>

<script setup>
import { User, NotebookPen, CreditCard, LogOut } from "lucide-vue-next"


const router = useRouter();

defineProps({
  first_name: {
    type: String,
    required: true,
    default: "Guest",
  },
})
</script>