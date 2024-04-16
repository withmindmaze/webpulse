import { ActionFunction, json, LoaderFunction } from "@remix-run/node";
import { Language } from "remix-i18next";
import { i18nHelper } from "~/locale/i18n.utils";
import { getOnboardingSession, OnboardingSessionWithDetails } from "~/modules/onboarding/db/onboardingSessions.db.server";
import { OnboardingSessionActionDto } from "~/modules/onboarding/dtos/OnboardingSessionActionDto";
import OnboardingSessionService from "~/modules/onboarding/services/OnboardingSessionService";

type LoaderData = {
  item: OnboardingSessionWithDetails | null;
  i18n: Record<string, Language>;
};
export let loader: LoaderFunction = async ({ request, params }) => {
  const { translations } = await i18nHelper(request);
  const item = await getOnboardingSession(params.id!);
  const data: LoaderData = {
    item,
    i18n: translations,
  };
  return json(data);
};

export const action: ActionFunction = async ({ request, params }) => {
  const { t } = await i18nHelper(request);
  const form = await request.formData();
  const action = form.get("action");
  const session = await getOnboardingSession(params.id!);
  if (!session) {
    return json({ error: "Session not found" }, { status: 404 });
  }
  const actions: OnboardingSessionActionDto[] = form.getAll("actions[]").map((f: FormDataEntryValue) => {
    return JSON.parse(f.toString());
  });
  if (action === "started") {
    await OnboardingSessionService.started(session);
  } else if (action === "dismissed") {
    await OnboardingSessionService.dismissed(session);
  } else if (action === "add-actions") {
    await OnboardingSessionService.addActions(session, { actions });
  } else if (action === "set-step") {
    await OnboardingSessionService.setStep(session, {
      fromIdx: Number(form.get("fromIdx")),
      toIdx: Number(form.get("toIdx")),
      actions,
    });
  } else if (action === "complete") {
    await OnboardingSessionService.complete(session, {
      fromIdx: Number(form.get("fromIdx")),
      actions,
    });
  } else {
    return json({ error: t("shared.invalidForm") }, { status: 400 });
  }
  return json({});
};
