import { StaffProfileCell, StaffRoleCell, StaffStatusCell, StaffJoinedCell, StaffActionsCell } from "../fragments/TableCells";

export const getStaffTableColumns = (onEdit, onDelete) => [
    {
        header: "Profile",
        key: "profile",
        render: (staff) => <StaffProfileCell staff={staff} />
    },
    {
        header: "Role & Permissions",
        key: "role",
        render: (staff) => <StaffRoleCell staff={staff} />
    },
    {
        header: "Account Status",
        key: "status",
        render: (staff) => <StaffStatusCell staff={staff} />
    },
    {
        header: "Joined",
        key: "joined",
        render: (staff) => <StaffJoinedCell staff={staff} />
    },
    {
        header: "Actions",
        key: "actions",
        align: "right",
        render: (staff) => <StaffActionsCell staff={staff} onEdit={onEdit} onDelete={onDelete} />
    }
];