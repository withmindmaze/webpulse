import { EntityTag } from "@prisma/client";
import { LoaderFunction, redirect, ActionFunction, json } from "@remix-run/node";
import { MetaTagsDto } from "~/application/dtos/seo/MetaTagsDto";
import { Colors } from "~/application/enums/shared/Colors";
import { EntitiesApi } from "~/utils/api/EntitiesApi";
import { RowsApi } from "~/utils/api/RowsApi";
import UrlUtils from "~/utils/app/UrlUtils";
import { getEntityTags, getEntityTag, createEntityTag, updateEntityTag, deleteEntityTag, getEntityTagById } from "~/utils/db/entities/entityTags.db.server";
import { getRowTag, createRowTag, deleteRowTags } from "~/utils/db/entities/rowTags.db.server";
import EntityHelper from "~/utils/helpers/EntityHelper";
import RowHelper from "~/utils/helpers/RowHelper";
import RowsRequestUtils from "../utils/RowsRequestUtils";
import { CustomError } from "~/application/dtos/shared/CustomError";

export namespace Rows_Tags {
  export type LoaderData = {
    meta: MetaTagsDto;
    rowData: RowsApi.GetRowData;
    routes: EntitiesApi.Routes;
    tags: EntityTag[];
  };
  export let loader: LoaderFunction = async ({ request, params }) => {
    const { t, userId, tenantId, entity } = await RowsRequestUtils.getLoader({ request, params });
    if (!entity.isAutogenerated || entity.type === "system") {
      throw redirect(tenantId ? UrlUtils.currentTenantUrl(params, "404") : "/404");
    }
    const rowData = await RowsApi.get(params.id!, {
      entity,
      tenantId,
      userId,
    });
    if (!rowData.rowPermissions.canUpdate) {
      throw json(new CustomError("You can't update this row", { permissions: rowData.rowPermissions }), { status: 403 });
    }
    const data: LoaderData = {
      meta: [{ title: `${t("shared.tag")} | ${RowHelper.getTextDescription({ entity, item: rowData.item, t })} | ${process.env.APP_NAME}` }],
      rowData,
      tags: await getEntityTags(entity.id),
      routes: EntityHelper.getNoCodeRoutes({ request, params }),
    };
    return json(data);
  };

  const badRequest = (data: { error: string }) => json(data, { status: 400 });
  export const action: ActionFunction = async ({ request, params }) => {
    const { t, userId, tenantId, entity, form } = await RowsRequestUtils.getAction({ request, params });
    const rowData = await RowsApi.get(params.id!, {
      entity,
      tenantId,
      userId,
    });
    const action = form.get("action");
    const { item } = rowData;
    if (!rowData.rowPermissions.canUpdate) {
      throw json(new CustomError("You can't update this row", { permissions: rowData.rowPermissions }), { status: 403 });
    }
    if (action === "new-tag") {
      const value = form.get("tag-name")?.toString() ?? "";
      const color = Number(form.get("tag-color") ?? Colors.INDIGO);
      let tag = await getEntityTag(entity.id, value);
      if (!tag) {
        tag = await createEntityTag({
          entityId: entity.id,
          value,
          color,
        });
      }
      const existingTag = await getRowTag(item.id, value);
      if (tag && !existingTag) {
        await createRowTag({
          rowId: item.id,
          tagId: tag.id,
        });
      }
      return json({});
    } else if (action === "edit-tag") {
      const id = form.get("tag-id")?.toString() ?? "";
      const value = form.get("tag-name")?.toString() ?? "";
      const color = Number(form.get("tag-color"));
      await updateEntityTag(id, {
        value,
        color,
      });
      return json({});
    } else if (action === "set-tag") {
      const id = form.get("tag-id")?.toString() ?? "";
      const tagAction = form.get("tag-action")?.toString() ?? "";
      if (tagAction === "add") {
        await createRowTag({
          rowId: item.id,
          tagId: id,
        });
      } else {
        await deleteRowTags(item.id, id);
      }
      return json({});
    } else if (action === "delete-tag") {
      const id = form.get("tag-id")?.toString() ?? "";
      const tag = await getEntityTagById(id);
      if (tag) {
        await deleteEntityTag(tag.id);
      }
      return json({});
    } else {
      return badRequest({ error: t("shared.invalidForm") });
    }
  };
}
