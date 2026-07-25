export interface navUserProps {
    user: {
        avatar: string,
        name: string,
        email: string
    },
    menuItems?: {
        title: string,
        icon: React.ReactNode,
        url: string,
        active?: boolean
    }[]
}