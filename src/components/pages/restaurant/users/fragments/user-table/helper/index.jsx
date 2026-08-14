import { UserProfileCell, UserStatusCell, UserJoinedCell, UserActionsCell } from "../fragments/TableCells";

export const getUserTableColumns = (onEdit, onDelete) => [
    {
        header: "Profile",
        key: "profile",
        render: (user) => <UserProfileCell user={user} />
    },
    {
        header: "Account Status",
        key: "status",
        render: (user) => <UserStatusCell user={user} />
    },
    {
        header: "Joined",
        key: "joined",
        render: (user) => <UserJoinedCell user={user} />
    },
    {
        header: "Actions",
        key: "actions",
        align: "right",
        render: (user) => <UserActionsCell user={user} onEdit={onEdit} onDelete={onDelete} />
    }
];
