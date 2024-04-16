import { MemberDeletedDto } from "~/application/dtos/events/MemberDeletedDto";
import { MemberInvitationAcceptedDto } from "~/application/dtos/events/MemberInvitationAcceptedDto";
import { MemberInvitationCreatedDto } from "~/application/dtos/events/MemberInvitationCreatedDto";
import { MemberUpdatedDto } from "~/application/dtos/events/MemberUpdatedDto";
import { ApplicationEvent } from "~/application/dtos/shared/ApplicationEvent";
import { baseURL } from "~/utils/url.server";
import { createApplicationEvent } from ".";

export async function createMemberInvitationCreatedEvent(tenantId: string, event: MemberInvitationCreatedDto) {
  return await createApplicationEvent(ApplicationEvent.MemberInvitationCreated, tenantId, event, [baseURL + `/webhooks/events/members/invited`]);
}

export async function createMemberInvitationAcceptedEvent(tenantId: string, event: MemberInvitationAcceptedDto) {
  return await createApplicationEvent(ApplicationEvent.MemberInvitationAccepted, tenantId, event, [baseURL + `/webhooks/events/members/invitation-accepted`]);
}

export async function createMemberUpdatedEvent(tenantId: string, event: MemberUpdatedDto) {
  return await createApplicationEvent(ApplicationEvent.MemberUpdated, tenantId, event, [process.env.SERVER_URL + `/webhooks/events/members/updated`]);
}

export async function createMemberDeletedEvent(tenantId: string, event: MemberDeletedDto) {
  return await createApplicationEvent(ApplicationEvent.MemberDeleted, tenantId, event, [process.env.SERVER_URL + `/webhooks/events/members/deleted`]);
}
