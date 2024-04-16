import { ActionFunction, json, LoaderFunction, redirect } from "@remix-run/node";
import { RowsApi } from "~/utils/api/RowsApi";
import { getEntityPermission, verifyUserHasPermission } from "~/utils/helpers/PermissionsHelper";
import { EntitiesApi } from "~/utils/api/EntitiesApi";
import UrlUtils from "~/utils/app/UrlUtils";
import EntityHelper from "~/utils/helpers/EntityHelper";
import { EntityViewsApi } from "~/utils/api/EntityViewsApi";
import { getEntityView, deleteEntityView } from "~/utils/db/entities/entityViews.db.server";
import { MetaTagsDto } from "~/application/dtos/seo/MetaTagsDto";
import RowsRequestUtils from "../utils/RowsRequestUtils";
import { createMetrics } from "~/modules/metrics/utils/MetricTracker";
import FormulaService from "~/modules/formulas/services/FormulaService";
import { EntityView } from "@prisma/client";
import { getRowsInIds } from "~/utils/db/entities/rows.db.server";

export namespace Rows_List {
  export type LoaderData = {
    meta: MetaTagsDto;
    rowsData: RowsApi.GetRowsData;
    routes: EntitiesApi.Routes;
  };
  export let loader: LoaderFunction = async ({ request, params }) => {
    const { time, getServerTimingHeader } = await createMetrics({ request, params }, `[Rows_List] ${params.entity}`);
    const { t, userId, tenantId, entity } = await RowsRequestUtils.getLoader({ request, params });
    await time(verifyUserHasPermission(request, getEntityPermission(entity, "view"), tenantId), "verifyUserHasPermission");
    if (!entity.isAutogenerated || entity.type === "system") {
      throw redirect(tenantId ? UrlUtils.currentTenantUrl(params, "404") : "/404");
    }
    const rowsData = await time(
      RowsApi.getAll({
        entity,
        tenantId,
        userId,
        urlSearchParams: new URL(request.url).searchParams,
        time,
      }),
      "RowsApi.getAll"
    );
    await time(
      FormulaService.trigger({ trigger: "BEFORE_LISTED", rows: rowsData.items, entity: rowsData.entity, session: { tenantId, userId }, t }),
      "FormulaService.trigger.BEFORE_LISTED"
    );
    const data: LoaderData = {
      meta: [{ title: `${t(entity.titlePlural)} | ${process.env.APP_NAME}` }],
      rowsData,
      routes: EntityHelper.getNoCodeRoutes({ request, params }),
    };
    return json(data, { headers: getServerTimingHeader() });
  };

  export type ActionData = {
    success?: string;
    error?: string;
    updatedView?: EntityView;
    rowsDeleted?: string[];
  };
  export const action: ActionFunction = async ({ request, params }) => {
    const { time, getServerTimingHeader } = await createMetrics({ request, params }, `[Rows_List] ${params.entity}`);
    const { t, userId, tenantId, entity, form } = await RowsRequestUtils.getAction({ request, params });
    const action = form.get("action")?.toString() ?? "";
    if (action === "view-create") {
      try {
        const view = await time(EntityViewsApi.createFromForm({ entity, form, createdByUserId: userId }), "EntityViewsApi.createFromForm");
        return redirect(new URL(request.url, request.url).pathname + "?v=" + view.name, { headers: getServerTimingHeader() });
      } catch (e: any) {
        return json({ error: e.message }, { status: 400, headers: getServerTimingHeader() });
      }
    } else if (action === "view-edit" || action === "view-delete") {
      const id = form.get("id")?.toString() ?? "";
      const item = await time(getEntityView(id), "getEntityView");
      if (!item) {
        return json({ error: t("shared.notFound") }, { status: 400, headers: getServerTimingHeader() });
      }
      try {
        if (action === "view-edit") {
          const updatedView = await time(EntityViewsApi.updateFromForm({ entity, item, form }), "EntityViewsApi.updateFromForm");
          return json({ updatedView }, { headers: getServerTimingHeader() });
        } else {
          await time(deleteEntityView(item.id), "deleteEntityView");
          return redirect(new URL(request.url, request.url).pathname + "?v=", { headers: getServerTimingHeader() });
        }
      } catch (e: any) {
        return json({ error: e.message }, { status: 400, headers: getServerTimingHeader() });
      }
    } else if (["move-up", "move-down"].includes(action)) {
      const id = form.get("id")?.toString() ?? "";
      await time(
        RowsApi.changeOrder(id, {
          target: action === "move-up" ? "up" : "down",
        }),
        "RowsApi.changeOrder"
      );
      return json({ success: true, headers: getServerTimingHeader() });
    } else if (action === "bulk-delete") {
      if (!entity.hasBulkDelete) {
        return json({ error: t("shared.invalidForm") }, { status: 400, headers: getServerTimingHeader() });
      }
      const rowIds = form.getAll("rowIds[]") as string[];
      try {
        const rows = await getRowsInIds(rowIds);
        const inexistentRows = rowIds.filter((id) => !rows.find((f) => f.id === id));
        if (inexistentRows.length > 0) {
          return json({ error: t("shared.notFound") }, { status: 400, headers: getServerTimingHeader() });
        }
        const rowsDeleted: string[] = [];
        await Promise.all(
          rows.map(async (row) => {
            const deleted = await RowsApi.del(row.id, { entity, tenantId, userId });
            rowsDeleted.push(deleted.id);
          })
        );
        return json({ success: t("shared.deleted"), rowsDeleted }, { headers: getServerTimingHeader() });
      } catch (e: any) {
        return json({ error: e.message }, { status: 400, headers: getServerTimingHeader() });
      }
    } else {
      return json({ error: t("shared.invalidForm") }, { status: 400, headers: getServerTimingHeader() });
    }
  };
}
