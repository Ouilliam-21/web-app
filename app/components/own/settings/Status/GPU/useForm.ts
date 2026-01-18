import { GPUStatus } from "@Ouilliam-21/database";
import { useClipboard } from "@vueuse/core";
import { computed, ref } from "vue";

import { useFetch } from "#app";
import type { ApiSuccess } from "~~/shared/server/handler";

type GpuData = {
    status: GPUStatus;
    ip: string;
};


export const useForm = (options: {
    response: ApiSuccess<GpuData>
}) => {

    const { response } = options
    const { success, error } = useToast()

    const ip = ref('')
    const isPending = ref(false)

    const activeResponse = ref(response.data)

    const statusColor = computed(() => {

        switch (activeResponse.value.status) {
            case GPUStatus.RUNNING:
                return "bg-green-500";
            case GPUStatus.STARTING:
                return "bg-yellow-500";
            default:
            case GPUStatus.SHUTDOWN:
                return "bg-gray-500";
        }
    });

    const statusLabel = computed(() => {
        switch (activeResponse.value.status) {
            case GPUStatus.RUNNING:
                return "Running";
            case GPUStatus.STARTING:
                return "Starting";
            default:
            case GPUStatus.SHUTDOWN:
                return "Shutdown";
        }
    });

    const onStart = async () => {
        isPending.value = true
        activeResponse.value.status = GPUStatus.STARTING

        const { data, error: err } = await useFetch("/api/digitalocean/start");

        if (isPresent(err.value)) {
            activeResponse.value.status = GPUStatus.SHUTDOWN;
            error("Error: " + err.value.message)
        } else if (isAbsent(data.value)) {
            activeResponse.value.status = GPUStatus.SHUTDOWN;
            error("No data returned")
        } else if (data.value.type === 'error') {
            activeResponse.value.status = GPUStatus.SHUTDOWN;
            error("Error: " + data.value.detail)
        } else {
            activeResponse.value = { status: GPUStatus.RUNNING, ip: data.value.data.ip }
            success("GPU started at ip :" + data.value.data.ip)
        }

        isPending.value = false
    };

    const onStop = async () => {
        isPending.value = true

        const { data, error: err } = await useFetch("/api/digitalocean/stop");

        if (isPresent(err.value)) {
            activeResponse.value.status = GPUStatus.RUNNING;
            error("Error: " + err.value.message)
        } else if (isAbsent(data.value)) {
            activeResponse.value.status = GPUStatus.RUNNING;
            error("No data returned")
        } else if (data.value.type === 'error') {
            activeResponse.value.status = GPUStatus.RUNNING;
            error("Error: " + data.value.detail)
        } else {
            activeResponse.value = { status: GPUStatus.SHUTDOWN, ip: '' };
            success("GPU successfully shutdown.");
        }

        isPending.value = false;
    };

    const { copy } = useClipboard({ source: ip });

    const onCopy = (source: string) => copy(source)

    return {
        statusColor, statusLabel, activeResponse, onCopy, onStart, onStop
    }
}