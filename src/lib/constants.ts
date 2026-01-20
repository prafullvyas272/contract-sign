export const BRAND = {
  primary: "#303596",
  name: "Contract Sign.",
};

export const CONTRACT_STATUS = {
  PENDING: "pending",
  SIGNED: "signed",
  REJECTED: "rejected",
} as const;

export const ROUTES = {
  dashboard: "/dashboard/contracts",
  profile: "/dashboard/profile",
  contracts: "/dashboard/contracts",
  contractStatus: "/dashboard/contracts/status",
  team: "/dashboard/team",
  templates: "/dashboard/templates",
  newContract: "/dashboard/contracts/new",
  newTemplate: "/dashboard/templates/new",
  wallet: "/dashboard/wallet",
  teams: "/dashboard/teams",
  newTeamMember: "/dashboard/team/new",
  log:"/dashboard/log"
} as const;
