<script setup lang="ts">
import { Ellipsis } from "lucide-vue-next";

import { Button } from "@/components/ui/button";
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from '@/components/ui/label'

const autoScroll = defineModel<boolean>("autoScroll", { required: true });

</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="outline" size="icon">
        <Ellipsis />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-56" align="start">
      <DropdownMenuLabel>Settings</DropdownMenuLabel>
      <DropdownMenuGroup>
        <DropdownMenuItem>
          <div class="flex items-center space-x-2">
            <Label for="airplane-mode">Auto scroll</Label>
            <Checkbox id="terms" v-model:model-value="autoScroll"/>
          </div>
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
