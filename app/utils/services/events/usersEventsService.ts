import { UserProfileUpdatedDto } from "~/application/dtos/events/UserProfileUpdatedDto";
import { ApplicationEvent } from "~/application/dtos/shared/ApplicationEvent";
import NotificationService from "~/modules/notifications/services/NotificationService";
import { baseURL } from "~/utils/url.server";
import { createApplicationEvent } from ".";

export async function createUserProfileUpdatedEvent(tenantId: string, event: UserProfileUpdatedDto) {
  await NotificationService.sendToRoles({
    channel: "admin-users",
    tenantId: null,
    notification: {
      message: `${event.email} updated their profile`,
    },
  });
  return await createApplicationEvent(ApplicationEvent.UserProfileUpdated, tenantId, event, [baseURL + `/webhooks/events/users/profile-updated`]);
}
