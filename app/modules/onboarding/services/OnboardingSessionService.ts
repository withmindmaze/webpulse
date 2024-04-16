import { OnboardingSessionWithDetails } from "../db/onboardingSessions.db.server";
import { OnboardingSessionActionDto } from "../dtos/OnboardingSessionActionDto";

async function started(session: OnboardingSessionWithDetails) {
  throw Error("Enterprise feature 🚀");
}

async function dismissed(session: OnboardingSessionWithDetails) {
  throw Error("Enterprise feature 🚀");
}

async function setStep(session: OnboardingSessionWithDetails, data: { fromIdx: number; toIdx: number; actions: OnboardingSessionActionDto[] }) {
  throw Error("Enterprise feature 🚀");
}

async function addActions(session: OnboardingSessionWithDetails, data: { actions: OnboardingSessionActionDto[] }) {
  throw Error("Enterprise feature 🚀");
}

async function complete(session: OnboardingSessionWithDetails, data: { fromIdx: number; actions: OnboardingSessionActionDto[] }) {
  throw Error("Enterprise feature 🚀");
}

export default {
  started,
  dismissed,
  setStep,
  complete,
  addActions,
};
