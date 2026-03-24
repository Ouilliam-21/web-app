<script setup lang="ts">
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'

import Processing from "./Processing/Container.vue"
import Waiting from "./Waiting/Container.vue"
</script>
<template>
    <ResizablePanelGroup direction="vertical" class="h-full min-h-0 gap-3">
        <ResizablePanel :default-size="70" :max-size="70" :min-size="20">
            <Waiting class="h-full min-h-0"/>
        </ResizablePanel>
        <ResizableHandle with-handle-vertical/>
        <ResizablePanel :default-size="30" :max-size="80" :min-size="20">
            <Processing class="h-full min-h-0"/>
        </ResizablePanel>
    </ResizablePanelGroup>
</template>