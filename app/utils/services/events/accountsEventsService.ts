import { AccountCreatedDto } from "~/application/dtos/events/AccountCreatedDto";
import { ApplicationEvent } from "~/application/dtos/shared/ApplicationEvent";
import NotificationService from "~/modules/notifications/services/NotificationService";
import { baseURL } from "~/utils/url.server";
import { createApplicationEvent } from ".";

export async function createAccountCreatedEvent(tenantId: string, event: AccountCreatedDto) {
  await NotificationService.sendToRoles({
    channel: "admin-accounts",
    tenantId,
    notification: {
      message: `Account created: ${event.tenant.name}`,
      action: {
        title: "View account",
        url: `/admin/accounts/${event.tenant.id}`,
      },
    },
  });
  return await createApplicationEvent(ApplicationEvent.AccountCreated, tenantId, event, [baseURL + `/webhooks/events/accounts/created`]);
}
