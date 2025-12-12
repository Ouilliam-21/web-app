<script setup lang="ts">
import { Clock, User } from "lucide-vue-next";
import { ref } from "vue";

import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

// Mock data for clip history
const clipHistory = ref([
    {
        id: "1",
        title: "Amazing Play - Round 3",
        userName: "John Doe",
        timestamp: "2025-01-15 14:30:25",
        duration: "2 minutes",
    },
    {
        id: "2",
        title: "Epic Team Fight",
        userName: "Jane Smith",
        timestamp: "2025-01-15 14:15:10",
        duration: "1 minute",
    },
    {
        id: "3",
        title: "Game Winning Moment",
        userName: "Bob Johnson",
        timestamp: "2025-01-15 13:45:33",
        duration: "30 seconds",
    },
    {
        id: "4",
        title: "Incredible Save",
        userName: "Alice Williams",
        timestamp: "2025-01-15 13:20:15",
        duration: "3 minutes",
    },
    {
        id: "5",
        title: "Perfect Combo",
        userName: "Charlie Brown",
        timestamp: "2025-01-15 12:55:42",
        duration: "1 minute",
    },
    {
        id: "6",
        title: "Clutch Moment",
        userName: "Diana Prince",
        timestamp: "2025-01-15 12:30:08",
        duration: "2 minutes",
    },
    {
        id: "5",
        title: "Perfect Combo",
        userName: "Charlie Brown",
        timestamp: "2025-01-15 12:55:42",
        duration: "1 minute",
    },
    {
        id: "6",
        title: "Clutch Moment",
        userName: "Diana Prince",
        timestamp: "2025-01-15 12:30:08",
        duration: "2 minutes",
    },
]);

const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};
</script>

<template>
    <Card class="h-full min-h-0 flex flex-col">
        <CardHeader>
            <CardTitle
                >Next tasks <span class="text-sm">({{ clipHistory.length }})</span></CardTitle
            >
            <CardDescription>Futur operations</CardDescription>
        </CardHeader>
        <CardContent class="flex-1 min-h-0">
            <ScrollArea class="h-full min-h-0">
                <div class="space-y-3 pr-4">
                    <div
                        v-for="clip in clipHistory"
                        :key="clip.id"
                        class="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
                    >
                        <div class="space-y-2">
                            <h4 class="font-semibold text-sm">
                                {{ clip.title }}
                            </h4>
                            <div
                                class="flex items-center gap-4 text-xs text-muted-foreground"
                            >
                                <div class="flex items-center gap-1">
                                    <User class="size-3" />
                                    <span>{{ clip.userName }}</span>
                                </div>
                                <div class="flex items-center gap-1">
                                    <Clock class="size-3" />
                                    <span>{{
                                        formatTime(clip.timestamp)
                                    }}</span>
                                </div>
                            </div>
                            <Badge variant="secondary" class="text-xs">
                                {{ clip.duration }}
                            </Badge>
                        </div>
                    </div>
                </div>
            </ScrollArea>
        </CardContent>
    </Card>
</template>
