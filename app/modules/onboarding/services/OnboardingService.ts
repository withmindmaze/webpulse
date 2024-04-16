import { OnboardingFilter } from "@prisma/client";
import { getAppConfiguration } from "~/utils/db/appConfiguration.db.server";
import { OnboardingWithDetails } from "../db/onboarding.db.server";
import { OnboardingSessionWithDetails } from "../db/onboardingSessions.db.server";
import { OnboardingCandidateDto } from "../dtos/OnboardingCandidateDto";
import { OnboardingFilterMetadataDto } from "../dtos/OnboardingFilterMetadataDto";

async function getUserActiveOnboarding(_: { userId: string; tenantId: string | null }): Promise<OnboardingSessionWithDetails | null> {
  const appConfiguration = await getAppConfiguration();
  if (!appConfiguration.onboarding.enabled) {
    return null;
  }
  throw Error("Enterprise feature 🚀");
}

async function getMatchingFilters(_: { userId: string; tenantId: string | null; filters: OnboardingFilter[] }): Promise<OnboardingFilter[]> {
  throw Error("Enterprise feature 🚀");
}

async function setOnboardingStatus(_id: string, _active: boolean): Promise<void> {
  throw Error("Enterprise feature 🚀");
}

async function getCandidates(_: OnboardingWithDetails): Promise<OnboardingCandidateDto[]> {
  throw Error("Enterprise feature 🚀");
}

async function getMetadata(): Promise<OnboardingFilterMetadataDto> {
  throw Error("Enterprise feature 🚀");
}

export type OnboardingSummaryDto = {
  onboardings: { all: number; active: number };
  sessions: { all: number; active: number; dismissed: number; completed: number };
};
async function getSummary(): Promise<OnboardingSummaryDto> {
  throw Error("Enterprise feature 🚀");
}

export default {
  getUserActiveOnboarding,
  getMatchingFilters,
  setOnboardingStatus,
  getCandidates,
  getMetadata,
  getSummary,
};
