import { ViewFilterCondition } from "~/application/enums/entities/ViewFilterCondition";
import { Colors } from "~/application/enums/shared/Colors";

export type TemplateEntityPropertyTypeDto =
  | "number"
  | "string"
  | "date"
  | "media"
  | "select"
  | "boolean"
  | "multiSelect"
  | "multiText"
  | "rangeNumber"
  | "rangeDate"
  | "formula";
export type TemplateEntityViewDto = {
  layout: "table" | "board";
  name: string;
  title: string;
  properties: string[];
  filters?: { match?: "and" | "or"; name: string; condition: ViewFilterCondition; value: string }[];
  sort?: { name: string; asc: boolean }[];
  isDefault?: boolean;
  isSystem?: boolean;
  tenantId?: string | null;
  userId?: string | null;
  pageSize?: number;
  order?: number;
  groupByWorkflowStates?: boolean;
  groupByProperty?: string;
};
export type TemplateEntityDto = {
  type: string;
  name: string;
  slug: string;
  title: string;
  titlePlural: string;
  prefix: string;
  properties: {
    name: string;
    title: string;
    type: TemplateEntityPropertyTypeDto;
    subtype?: string | null;
    isDynamic?: boolean;
    isRequired?: boolean;
    isDisplay?: boolean;
    showInCreate?: boolean;
    isReadOnly?: boolean;
    canUpdate?: boolean;
    attributes?: { name: string; value: string }[];
    options?: { value: string; name?: string; color?: Colors }[];
    tenantId?: string | null;
  }[];
  isAutogenerated?: boolean;
  hasApi?: boolean;
  icon?: string;
  active?: boolean;
  showInSidebar?: boolean;
  hasTags?: boolean;
  hasComments?: boolean;
  hasTasks?: boolean;
  hasActivity?: boolean;
  hasBulkDelete?: boolean;
  defaultVisibility?: string;
  onCreated?: string;
  onEdit?: string;
  workflow?: {
    states: { name: string; title: string; color: Colors; canUpdate?: boolean; canDelete?: boolean }[];
    steps: { from: string; title: string; to: string }[];
  };
  views?: TemplateEntityViewDto[];
};
export type TemplateRelationshipDto = {
  parent: string;
  child: string;
  order: number;
  title?: string | null;
  type: string;
  required: boolean;
  cascade?: boolean;
  readOnly?: boolean;
  hiddenIfEmpty?: boolean;
};
export type EntitiesTemplateDto = {
  entities: TemplateEntityDto[];
  relationships: TemplateRelationshipDto[];
};
