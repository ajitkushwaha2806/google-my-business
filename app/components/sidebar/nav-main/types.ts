export interface NavMainProps {
    title?: string;
    items: {
        title: string
        url: string
        icon?: React.ReactNode
        isActive?: boolean
        items?: {
            title: string
            url: string
            icon?: React.ReactNode
        }[]
    }[]
}