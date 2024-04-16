import { TFunction } from "react-i18next";
import { OnboardingWithDetails } from "../db/onboarding.db.server";

async function setSteps(_: { item: OnboardingWithDetails; form: FormData; t: TFunction }) {
  throw Error("Enterprise feature 🚀");
}
export default {
  setSteps,
};
