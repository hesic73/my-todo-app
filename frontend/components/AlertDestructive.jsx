import { AlertCircle } from "lucide-react"

import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"

/**
 * 
 * @param {object} props
 * @param {string} props.description
 * @param {string} [props.className] // optional className prop
 * @returns 
 */
export function AlertDestructive({ description, className }) {
    return (
        <Alert className={className} variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
                {description}
            </AlertDescription>
        </Alert>
    );
}
