import { json } from "@remix-run/node";
import { Params, useMatches } from "@remix-run/react";
import { CookieCategory } from "~/application/cookies/CookieCategory";
import { commitAnalyticsSession, destroyAnalyticsSession, generateAnalyticsUserId, getAnalyticsSession } from "../analyticsCookie.server";
import { AppConfiguration, getAppConfiguration } from "../db/appConfiguration.db.server";
import CookieHelper from "../helpers/CookieHelper";
import { commitSession, createUserSession, generateCSRFToken, getUserInfo, getUserSession, UserSession } from "../session.server";
import { baseURL } from "../url.server";
import { MetaTagsDto } from "~/application/dtos/seo/MetaTagsDto";
import { promiseHash } from "../promises/promiseHash";
import { createMetrics } from "~/modules/metrics/utils/MetricTracker";
import { getUser } from "../db/users.db.server";
import { ImpersonatingSessionDto } from "~/application/dtos/session/ImpersonatingSessionDto";

export type AppRootData = {
  metaTags: MetaTagsDto;
  serverUrl: string;
  domainName: string;
  userSession: UserSession;
  authenticated: boolean;
  debug: boolean;
  isStripeTest: boolean;
  chatWebsiteId?: string;
  appConfiguration: AppConfiguration;
  csrf?: string;
  featureFlags: string[];
  impersonatingSession: ImpersonatingSessionDto | null;
};

export function useRootData(): AppRootData {
  return (useMatches().find((f) => f.pathname === "/" || f.pathname === "")?.data ?? {}) as AppRootData;
}

export async function loadRootData({ request, params }: { request: Request; params: Params }) {
  const { time, getServerTimingHeader } = await createMetrics({ request, params }, "root");
  const { userInfo, session, analyticsSession } = await time(
    promiseHash({
      userInfo: getUserInfo(request),
      session: getUserSession(request),
      analyticsSession: getAnalyticsSession(request),
    }),
    "loadRootData.session"
  );

  const csrf = generateCSRFToken();
  session.set("csrf", csrf);

  const headers = new Headers();
  if (!session.get("userAnalyticsId")) {
    return createUserSession({ ...userInfo, userAnalyticsId: generateAnalyticsUserId() }, new URL(request.url).pathname);
  }
  headers.append("Set-Cookie", await commitSession(session));
  let userAnalyticsId = analyticsSession.get("userAnalyticsId");
  if (CookieHelper.hasConsent(userInfo, CookieCategory.ANALYTICS)) {
    if (!userAnalyticsId) {
      userAnalyticsId = generateAnalyticsUserId();
      analyticsSession.set("userAnalyticsId", userAnalyticsId);
    }
    headers.append("Set-Cookie", await commitAnalyticsSession(analyticsSession));
  } else {
    headers.append("Set-Cookie", await destroyAnalyticsSession(analyticsSession));
  }

  let impersonatingSession: ImpersonatingSessionDto | null = null;
  if (userInfo.impersonatingFromUserId && userInfo.userId?.length > 0) {
    const fromUser = await getUser(userInfo.impersonatingFromUserId);
    const toUser = await getUser(userInfo.userId);
    if (fromUser && toUser) {
      impersonatingSession = { fromUser, toUser };
    }
  }

  const appConfiguration = await time(getAppConfiguration(), "getAppConfiguration");
  const data: AppRootData = {
    metaTags: [{ title: `${process.env.APP_NAME}` }],
    serverUrl: `${baseURL}`,
    domainName: `${process.env.DOMAIN_NAME}`,
    userSession: userInfo,
    authenticated: userInfo.userId?.length > 0,
    debug: process.env.NODE_ENV === "development",
    isStripeTest: process.env.STRIPE_SK?.toString().startsWith("sk_test_") ?? true,
    chatWebsiteId: process.env.CRISP_CHAT_WEBSITE_ID?.toString(),
    appConfiguration,
    csrf,
    featureFlags: process.env.NODE_ENV === "development" ? new URL(request.url).searchParams.getAll("debugFlag") : [],
    impersonatingSession,
  };

  const updateLightOrDarkMode = appConfiguration.app.supportedThemes !== "light-and-dark" && userInfo.lightOrDarkMode !== appConfiguration.app.supportedThemes;
  const updateMetrics = userInfo.userId?.length > 0 && appConfiguration.metrics.enabled !== userInfo.metrics?.enabled;
  const needsToUpdateSession = updateLightOrDarkMode || updateMetrics;
  if (needsToUpdateSession) {
    return createUserSession(
      {
        ...userInfo,
        lightOrDarkMode: appConfiguration.app.supportedThemes,
        metrics: appConfiguration.metrics,
      },
      new URL(request.url).pathname
    );
  }

  headers.append("Server-Timing", getServerTimingHeader()["Server-Timing"]);
  return json(data, { headers });
}
