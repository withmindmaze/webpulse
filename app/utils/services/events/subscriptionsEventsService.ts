import { SubscriptionCancelledDto } from "~/application/dtos/events/SubscriptionCancelledDto";
import { SubscriptionSubscribedDto } from "~/application/dtos/events/SubscriptionSubscribedDto";
import { ApplicationEvent } from "~/application/dtos/shared/ApplicationEvent";
import NotificationService from "~/modules/notifications/services/NotificationService";
import { baseURL } from "~/utils/url.server";
import { createApplicationEvent } from ".";

export async function createSubscriptionSubscribedEvent(tenantId: string, event: SubscriptionSubscribedDto) {
  await NotificationService.sendToRoles({
    channel: "admin-subscriptions",
    tenantId: null,
    notification: {
      message: `${event.user.email} subscribed to ${event.subscription.product.title}`,
    },
  });
  return await createApplicationEvent(ApplicationEvent.SubscriptionSubscribed, tenantId, event, [baseURL + `/webhooks/events/subscriptions/subscribed`]);
}

export async function createSubscriptionCancelledEvent(tenantId: string, event: SubscriptionCancelledDto) {
  await NotificationService.sendToRoles({
    channel: "admin-subscriptions",
    tenantId: null,
    notification: {
      message: `${event.user.email} cancelled their subscription ${event.subscription?.product.title ?? ""}`,
      action: { url: `/admin/accounts/${tenantId}` },
    },
  });
  return await createApplicationEvent(ApplicationEvent.SubscriptionCancelled, tenantId, event, [baseURL + `/webhooks/events/subscriptions/cancelled`]);
}
