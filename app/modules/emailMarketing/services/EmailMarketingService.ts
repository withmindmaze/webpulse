import { Campaign, EmailSender } from "@prisma/client";
import { ContactDto } from "../../crm/services/CrmService";
import { CampaignWithDetails } from "../db/campaigns.db.server";

export type EmailMarketingSummaryDto = {
  avgOpenRate: number;
  avgClickRate: number;
  outboundEmails: {
    sent: number;
    delivered: number;
  };
};
async function getSummary(_: string | null): Promise<EmailMarketingSummaryDto> {
  throw Error("Enterprise feature 🚀");
}

async function sendPreview(_data: {
  from: { tenantId: string | null; sender: EmailSender };
  email: { to: string; subject: string; htmlBody: string; textBody: string; track: true };
}): Promise<boolean> {
  throw Error("Enterprise feature 🚀");
}

async function sendContactPreview(_data: {
  contactRowId: string;
  from: { tenantId: string | null; sender: EmailSender };
  email: { to: string; subject: string; htmlBody: string; textBody: string; track: boolean };
}): Promise<boolean> {
  throw Error("Enterprise feature 🚀");
}

async function createCampaignDraft(_data: {
  name: string;
  contactViewId: string | undefined;
  from: { tenantId: string | null; sender: EmailSender };
  email: {
    subject: string;
    htmlBody: string;
    textBody: string | undefined;
    track: boolean;
  };
}): Promise<Campaign> {
  throw Error("Enterprise feature 🚀");
}

async function getContactMarketingSubscribersFromView(_data: { contactViewId: string | undefined; tenantId: string | null }): Promise<ContactDto[]> {
  throw Error("Enterprise feature 🚀");
}

async function sendCampaignTest(_campaign: CampaignWithDetails, _email: string): Promise<boolean> {
  throw Error("Enterprise feature 🚀");
}

async function sendCampaign(_campaign: CampaignWithDetails): Promise<boolean> {
  throw Error("Enterprise feature 🚀");
}

export default {
  getSummary,
  getContactMarketingSubscribersFromView,
  sendPreview,
  sendContactPreview,
  createCampaignDraft,
  sendCampaignTest,
  sendCampaign,
};
