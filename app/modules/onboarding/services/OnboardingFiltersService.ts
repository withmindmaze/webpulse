import { OnboardingFilter } from "@prisma/client";

async function matches({ userId, tenantId, filter }: { userId: string; tenantId: string | null; filter: OnboardingFilter }) {
  throw Error("Enterprise feature 🚀");
}

export default {
  matches,
};
