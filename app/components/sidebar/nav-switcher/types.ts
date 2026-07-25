export interface NavSwitcherProps {
    title?: string;
    addLabel?: string;
    businesses: {
        name: string
        logo: React.ReactNode
        address: string,
    }[]
}