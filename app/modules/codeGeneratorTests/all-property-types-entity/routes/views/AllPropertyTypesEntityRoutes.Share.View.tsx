// Route View (Client component): Share row with other accounts, users, roles, and groups
// Date: 2023-06-21
// Version: SaasRock v0.8.9

import { useTypedLoaderData } from "remix-typedjson";
import RowSettingsPermissions from "~/components/entities/rows/RowSettingsPermissions";
import { AllPropertyTypesEntityRoutesShareApi } from "../api/AllPropertyTypesEntityRoutes.Share.Api";

export default function AllPropertyTypesEntityRoutesShareView() {
  const data = useTypedLoaderData<AllPropertyTypesEntityRoutesShareApi.LoaderData>();
  return <RowSettingsPermissions item={data.item.row} items={data.item.row.permissions} tenants={data.tenants} users={data.users} />;
}
