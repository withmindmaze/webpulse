import { json, LoaderFunction, V2_MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import AnalyticsOverview from "~/components/analytics/AnalyticsOverview";
import IndexPageLayout from "~/components/ui/layouts/IndexPageLayout";
import EnterpriseFeature from "~/components/ui/misc/EnterpriseFeature";
import { i18nHelper } from "~/locale/i18n.utils";
import { AnalyticsOverviewDto } from "~/utils/services/analyticsService";

type LoaderData = {
  title: string;
  overview: AnalyticsOverviewDto;
};

export let loader: LoaderFunction = async ({ request }) => {
  const { t } = await i18nHelper(request);
  const overview: AnalyticsOverviewDto = {
    uniqueVisitors: 0,
    pageViews: 0,
    events: 0,
    liveVisitors: 0,
    top: {
      httpReferrers: [
        { name: "HTTP Referrer 1", count: 1 },
        { name: "HTTP Referrer 2", count: 2 },
      ],
      sources: [
        { name: "Source 1", count: 1 },
        { name: "Source 2", count: 2 },
      ],
      urls: [
        { name: "URL 1", count: 1 },
        { name: "URL 2", count: 2 },
      ],
      routes: [
        { name: "Route 1", count: 1 },
        { name: "Route 2", count: 2 },
      ],
      os: [
        { name: "OS 1", count: 1 },
        { name: "OS 2", count: 2 },
      ],
      devices: [
        { name: "Device 1", count: 1 },
        { name: "Device 2", count: 2 },
      ],
      countries: [
        { name: "Country 1", count: 1 },
        { name: "Country 2", count: 2 },
      ],
    },
  };
  return json({
    title: `${t("analytics.title")} | ${process.env.APP_NAME}`,
    overview,
  });
};

export const meta: V2_MetaFunction = ({ data }) => [{ title: data?.title }];

export default function AdminAnalticsRoute() {
  const { t } = useTranslation();
  const data = useLoaderData<LoaderData>();

  return (
    <IndexPageLayout
      replaceTitleWithTabs={true}
      tabs={[
        {
          name: t("analytics.overview"),
          routePath: "/admin/analytics/overview",
        },
        {
          name: t("analytics.uniqueVisitors"),
          routePath: "/admin/analytics/visitors",
        },
        {
          name: t("analytics.pageViews"),
          routePath: "/admin/analytics/page-views",
        },
        {
          name: t("analytics.events"),
          routePath: "/admin/analytics/events",
        },
        {
          name: t("analytics.settings"),
          routePath: "/admin/analytics/settings",
        },
      ]}
    >
      <EnterpriseFeature />
      <AnalyticsOverview overview={data.overview} />
    </IndexPageLayout>
  );
}
