<script lang="ts" setup>
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Search } from "lucide-vue-next";
</script>

<template>
  <Dialog>
    <DialogTrigger>
      <Search :size="20" class="cursor-pointer" />
    </DialogTrigger>
    <DialogContent>
      <Command>
        <CommandInput placeholder="Type a keyword for search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandSeparator />
          <CommandGroup heading="History">
            <CommandItem>for</CommandItem>
            <CommandItem>league</CommandItem>
            <CommandItem>wave</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </DialogContent>
  </Dialog>
</template>
