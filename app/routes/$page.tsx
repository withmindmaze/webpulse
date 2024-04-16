import { ActionFunction, json, LoaderFunction, V2_MetaFunction, redirect } from "@remix-run/node";
import { getCurrentPage } from "~/modules/pageBlocks/services/pagesService";
import PageBlocks from "~/modules/pageBlocks/components/blocks/PageBlocks";
import { PageBlockService } from "~/modules/pageBlocks/services/blocksService";
import { PageLoaderData } from "~/modules/pageBlocks/dtos/PageBlockData";
import ServerError from "~/components/ui/errors/ServerError";
import ErrorBanner from "~/components/ui/banners/ErrorBanner";
import { useTranslation } from "react-i18next";
import { useTypedLoaderData } from "remix-typedjson";
import { useEffect, useState } from "react";
import { createMetrics } from "~/modules/metrics/utils/MetricTracker";
import { serverTimingHeaders } from "~/modules/metrics/utils/defaultHeaders.server";
export { serverTimingHeaders as headers };

export const meta: V2_MetaFunction = ({ data }) => data?.metaTags;

export let loader: LoaderFunction = async ({ request, params }) => {
  const { time, getServerTimingHeader } = await createMetrics({ request, params }, params.page!);
  const page = await time(getCurrentPage({ request, params, slug: "/" + params.page }), "getCurrentPage." + params.page);
  if (!page.page && page.blocks.length === 0 && !params.page?.includes(".")) {
    return redirect("/404?page=" + params.page);
  }
  return json(page, { headers: getServerTimingHeader() });
};

export const action: ActionFunction = async ({ request, params }) => PageBlockService.action({ request, params });

export default function () {
  const { t } = useTranslation();
  const data = useTypedLoaderData<PageLoaderData>();
  const [blocks, setBlocks] = useState(data.blocks);
  useEffect(() => {
    setBlocks(data.blocks);
  }, [data]);
  return (
    <>
      {data.error ? (
        <div className="mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8">
          <ErrorBanner title={t("shared.error")} text={data.error} />
        </div>
      ) : (
        <PageBlocks items={blocks} onChange={setBlocks} />
      )}
    </>
  );
}

export function ErrorBoundary() {
  return <ServerError />;
}
