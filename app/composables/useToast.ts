import { toast as sonnerToast } from 'vue-sonner'

export const useToast = () => {
    const toast = (message: string, options?: {
        description?: string
        duration?: number
    }) => {
        return sonnerToast(message, options)
    }

    const success = (message: string, options?: {
        description?: string
        duration?: number
    }) => {
        return sonnerToast.success(message, options)
    }

    const error = (message: string, options?: {
        description?: string
        duration?: number
    }) => {
        return sonnerToast.error(message, options)
    }

    const warning = (message: string, options?: {
        description?: string
        duration?: number
    }) => {
        return sonnerToast.warning(message, options)
    }

    const info = (message: string, options?: {
        description?: string
        duration?: number
    }) => {
        return sonnerToast.info(message, options)
    }

    const loading = (message: string, options?: {
        description?: string
    }) => {
        return sonnerToast.loading(message, options)
    }

    return {
        toast,
        success,
        error,
        warning,
        info,
        loading,
        dismiss: sonnerToast.dismiss,
    }
}