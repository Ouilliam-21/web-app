<script setup lang="ts">
import Processing from "./Processing/Container.vue"
import Waiting from "./Waiting/Container.vue"

</script>
<template>
    <div class="grid grid-rows-[1fr_0.4fr] gap-3">
        <Waiting />
        <Processing />
    </div>
</template>