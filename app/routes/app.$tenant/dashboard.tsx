import { json, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { useSearchParams } from "@remix-run/react";
import { useAppData } from "~/utils/data/useAppData";
import { DashboardLoaderData, loadDashboardData } from "~/utils/data/useDashboardData";
import { i18nHelper } from "~/locale/i18n.utils";
import { getAppDashboardStats } from "~/utils/services/appDashboardService";
import ProfileBanner from "~/components/app/ProfileBanner";
import { DashboardStats } from "~/components/ui/stats/DashboardStats";
import { getTenantIdFromUrl } from "~/utils/services/urlService";
import { Stat } from "~/application/dtos/stats/Stat";
import InputSelector from "~/components/ui/input/InputSelector";
import PeriodHelper, { defaultPeriodFilter, PeriodFilters } from "~/utils/helpers/PeriodHelper";
import { useTranslation } from "react-i18next";
import ServerError from "~/components/ui/errors/ServerError";
import { serverTimingHeaders } from "~/modules/metrics/utils/defaultHeaders.server";
import { createMetrics } from "~/modules/metrics/utils/MetricTracker";
import { promiseHash } from "~/utils/promises/promiseHash";
import { getTenant } from "~/utils/db/tenants.db.server";
import { Fragment } from "react";
import { getTenantRelationshipsFrom, TenantRelationshipWithDetails } from "~/utils/db/tenants/tenantRelationships.db.server";
import LinkedAccountsTable from "~/components/core/linkedAccounts/LinkedAccountsTable";
import { useTypedLoaderData } from "remix-typedjson";
import { getUserHasPermission } from "~/utils/helpers/PermissionsHelper";
export { serverTimingHeaders as headers };
import { BarsArrowUpIcon, GlobeAltIcon } from '@heroicons/react/20/solid'
import React, { useEffect, useState } from 'react';
import InitiateLighHouse from "./lighthouse/initiate";
import lighthouse from 'lighthouse';

type LoaderData = DashboardLoaderData & {
  title: string;
  stats: Stat[];
  tenantRelationships: TenantRelationshipWithDetails[];
};

export let loader = async ({ request, params }: LoaderArgs) => {
  const { time, getServerTimingHeader } = await createMetrics({ request, params }, "app.$tenant.dashboard");
  let { t } = await time(i18nHelper(request), "i18nHelper");
  const tenantId = await time(getTenantIdFromUrl(params), "getTenantIdFromUrl");
  const tenant = await time(getTenant(tenantId), "getTenant");

  const { stats, dashboardData } = await time(
    promiseHash({
      stats: getAppDashboardStats({ t, tenant, gte: PeriodHelper.getGreaterThanOrEqualsFromRequest({ request }) }),
      dashboardData: loadDashboardData(params),
    }),
    "app.$tenant.dashboard.details"
  );

  const tenantRelationships = await getTenantRelationshipsFrom(tenantId);
  const data: LoaderData = {
    title: `${t("app.sidebar.dashboard")} | ${process.env.APP_NAME}`,
    ...dashboardData,
    stats,
    tenantRelationships,
  };
  return json(data, { headers: getServerTimingHeader() });
};

export const meta: V2_MetaFunction = ({ data }) => [{ title: data?.title }];

export default function DashboardRoute() {
  const { t } = useTranslation();
  const appData = useAppData();
  const data = useTypedLoaderData<LoaderData>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [device, setDevice] = useState('desktop');
  const [categories, setCategories] = useState({
    performance: true,
    accessibility: true,
    bestPractices: true,
    seo: true,
    pwa: true
  });

  const handleDeviceChange = (event: any) => {
    setDevice(event.target.value);
  };

  const handleCategoryChange = (event: any) => {
    setCategories({ ...categories, [event.target.name]: event.target.checked });
  };

  const handleAnalyzeClick = async () => {
    setIsLoading(true);
    const apiUrl = `http://localhost:3001/api/audit`;
    // Prepare categories array
    // @ts-ignore
    const selectedCategories = Object.keys(categories)
      .filter(key => categories[key])
      .map(key => key.toLowerCase());

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, categories: selectedCategories, device: device }),
      });
      const resData = await response.json();
      setReportData(resData);
      console.log("===>", resData);
    } catch (error) {
      console.error('Error during API call:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative z-0 h-screen flex-1 overflow-y-auto pb-8">
      {/*Page header */}
      {/* <div className="hidden bg-white shadow md:block lg:border-t lg:border-gray-200">
        <ProfileBanner user={appData.user} />
      </div> */}
      <div className="mt-8 flex flex-col justify-center items-center">
        <div className="max-w-2xl w-full">
          <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
            Get Performance
          </label>
          <div className="mt-2 flex rounded-md shadow-sm">
            <div className="relative flex flex-grow items-stretch focus-within:z-10">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <GlobeAltIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="email"
                name="email"
                id="email"
                className="block w-full rounded-l-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Enter URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
            <button
              type="button"
              className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              onClick={handleAnalyzeClick}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-t-4 border-b-4 border-gray-900 animate-spin" />
              ) : (
                <>
                  <BarsArrowUpIcon className="-ml-0.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                  Analyze
                </>
              )}
            </button>
          </div>
        </div>
        <InitiateLighHouse
          device={device}
          categories={categories}
          handleDeviceChange={handleDeviceChange}
          handleCategoryChange={handleCategoryChange}
        />
      </div>

      <div className="mx-auto grid max-w-5xl gap-5 px-4 py-5 sm:px-8">
        {getUserHasPermission(appData, "app.dashboard.view") ? (
          <Fragment>
            {data.tenantRelationships.length > 0 && (
              <div className="space-y-3 overflow-x-auto">
                <div className="flex items-center justify-between space-x-2">
                  <h3 className="flex-grow font-medium leading-4 text-gray-900">Linked Accounts</h3>
                </div>
                <LinkedAccountsTable items={data.tenantRelationships} />
              </div>
            )}

            {data.stats.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between space-x-2">
                  <h3 className="flex-grow font-medium leading-4 text-gray-900">{t("app.dashboard.summary")}</h3>
                  <div>
                    <InputSelector
                      className="w-44"
                      withSearch={false}
                      name="period"
                      value={searchParams.get("period")?.toString() ?? defaultPeriodFilter}
                      options={PeriodFilters.map((f) => {
                        return {
                          value: f.value,
                          name: t(f.name),
                        };
                      })}
                      setValue={(value) => {
                        if (value) {
                          searchParams.set("period", value?.toString() ?? "");
                        } else {
                          searchParams.delete("period");
                        }
                        setSearchParams(searchParams);
                      }}
                    />
                  </div>
                </div>
                <DashboardStats items={data.stats} />
              </div>
            )}
          </Fragment>
        ) : (
          <div className="font-medium">You don't have permission to view the dashboard.</div>
        )}
      </div>
    </main>
  );
}

export function ErrorBoundary() {
  return <ServerError />;
}
