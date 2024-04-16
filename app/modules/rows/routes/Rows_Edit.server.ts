import { ActionFunction, json, LoaderFunction, redirect } from "@remix-run/node";
import { MetaTagsDto } from "~/application/dtos/seo/MetaTagsDto";
import NotificationService from "~/modules/notifications/services/NotificationService";
import { EntitiesApi } from "~/utils/api/EntitiesApi";
import { RowsApi } from "~/utils/api/RowsApi";
import UrlUtils from "~/utils/app/UrlUtils";
import { EntityWithDetails, getAllEntities } from "~/utils/db/entities/entities.db.server";
import { getUser } from "~/utils/db/users.db.server";
import EntityHelper from "~/utils/helpers/EntityHelper";
import { verifyUserHasPermission, getEntityPermission } from "~/utils/helpers/PermissionsHelper";
import RowHelper from "~/utils/helpers/RowHelper";
import RowsRequestUtils from "../utils/RowsRequestUtils";
import { createMetrics } from "~/modules/metrics/utils/MetricTracker";
import FormulaService from "~/modules/formulas/services/FormulaService";

export namespace Rows_Edit {
  export type LoaderData = {
    meta: MetaTagsDto;
    rowData: RowsApi.GetRowData;
    routes: EntitiesApi.Routes;
    allEntities: EntityWithDetails[];
    relationshipRows: RowsApi.GetRelationshipRowsData;
  };
  export let loader: LoaderFunction = async ({ request, params }) => {
    const { time, getServerTimingHeader } = await createMetrics({ request, params }, `[Rows_Edit] ${params.entity}`);
    const { t, userId, tenantId, entity } = await RowsRequestUtils.getLoader({ request, params });
    const user = await time(getUser(userId), "getUser");
    await time(verifyUserHasPermission(request, getEntityPermission(entity, "update"), tenantId), "verifyUserHasPermission");
    if (!entity.isAutogenerated || entity.type === "system") {
      throw redirect(tenantId ? UrlUtils.currentTenantUrl(params, "404") : "/404?entity=" + params.entity);
    }
    const rowData = await time(
      RowsApi.get(params.id!, {
        entity,
        tenantId,
        userId,
      }),
      "RowsApi.get"
    );
    if (!rowData.rowPermissions.canUpdate && !user?.admin) {
      throw Error(t("shared.unauthorized"));
    }
    const data: LoaderData = {
      meta: [{ title: `${t("shared.edit")} | ${RowHelper.getTextDescription({ entity, item: rowData.item, t })} | ${process.env.APP_NAME}` }],
      rowData,
      routes: EntityHelper.getNoCodeRoutes({ request, params }),
      allEntities: await time(getAllEntities({ tenantId }), "getAllEntities"),
      relationshipRows: await time(RowsApi.getRelationshipRows({ entity, tenantId, userId }), "RowsApi.getRelationshipRows"),
    };
    return json(data, { headers: getServerTimingHeader() });
  };

  export const action: ActionFunction = async ({ request, params }) => {
    const { time, getServerTimingHeader } = await createMetrics({ request, params }, `[Rows_Edit] ${params.entity}`);
    const { t, userId, tenantId, entity, form } = await RowsRequestUtils.getAction({ request, params });
    const user = await getUser(userId);
    const { item } = await time(
      RowsApi.get(params.id!, {
        entity,
        tenantId,
        userId,
      }),
      "RowsApi.get"
    );
    const action = form.get("action");
    if (action === "edit") {
      try {
        const rowValues = RowHelper.getRowPropertiesFromForm({ t, entity, form, existing: item });
        const updatedRow = await time(
          RowsApi.update(params.id!, {
            entity,
            tenantId,
            userId,
            rowValues,
          }),
          "RowsApi.update"
        );
        await time(
          FormulaService.trigger({ trigger: "AFTER_UPDATED", rows: [updatedRow], entity: entity, session: { tenantId, userId }, t }),
          "FormulaService.trigger.AFTER_UPDATED"
        );
      } catch (error: any) {
        return json({ error: error.message }, { status: 400, headers: getServerTimingHeader() });
      }
      if (item.createdByUser) {
        await NotificationService.send({
          channel: "my-rows",
          to: item.createdByUser,
          notification: {
            from: { user },
            message: `${user?.email} updated ${RowHelper.getTextDescription({ entity, item })}`,
            action: {
              title: t("shared.view"),
              url: EntityHelper.getRoutes({ routes: EntityHelper.getNoCodeRoutes({ request, params }), entity, item })?.overview ?? "",
            },
          },
        });
      }
      const redirectTo = form.get("redirect")?.toString() || new URL(request.url).searchParams.get("redirect")?.toString();
      if (redirectTo) {
        return redirect(redirectTo, { headers: getServerTimingHeader() });
      }
      const updatedRow = await RowsApi.get(params.id!, { entity });
      return json({ updatedRow }, { headers: getServerTimingHeader() });
    } else if (action === "delete") {
      try {
        await RowsApi.del(params.id!, {
          entity,
          userId,
          checkPermissions: !user?.admin,
        });
      } catch (error: any) {
        return json({ error: error.message }, { status: 400, headers: getServerTimingHeader() });
      }
      const redirectTo = form.get("redirect")?.toString() || new URL(request.url).searchParams.get("redirect")?.toString();
      if (redirectTo) {
        return redirect(redirectTo, { headers: getServerTimingHeader() });
      }
      return json({ deleted: true }, { headers: getServerTimingHeader() });
    } else {
      return json({ error: t("shared.invalidForm") }, { status: 400, headers: getServerTimingHeader() });
    }
  };
}
