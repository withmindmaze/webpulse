import { TFunction } from "react-i18next";
import { MetaTagsDto } from "~/application/dtos/seo/MetaTagsDto";

export const siteTags = {
  title: "SaasRock | The One-Man SaaS Framework",
  description:
    "Quick start your MVP with out-of-the-box SaaS features like Authentication, Pricing & Subscriptions, Admin & App portals, Entity Builder (CRUD, API, Webhooks, Permissions, Logs...), Blogging, CRM, Email Marketing, Page Block Builder, Notifications, Onboarding, and more.",
  keywords: "remix,saas,tailwindcss,prisma,react,typescript,boilerplate,saas-kit,saas-boilerplate,stripe,postmark,admin-portal,app-dashboard,multi-tenancy",
  image: "https://yahooder.sirv.com/saasfrontends/remix/ss/cover.png",
  thumbnail: "https://yahooder.sirv.com/saasfrontends/remix/thumbnail.png",
  twitterCreator: "@AlexandroMtzG",
  twitterSite: "@saas_rock",
};

export function defaultSeoMetaTags({ t, slug }: { t: TFunction; slug?: string }): MetaTagsDto {
  if (slug === "/pricing") {
    siteTags.title = `${t("front.pricing.title")}`;
    siteTags.description = t("front.pricing.headline");
  } else if (slug === "/blog") {
    siteTags.title = `${t("blog.title")}`;
    siteTags.description = t("blog.headline");
  } else if (slug === "/contact") {
    siteTags.title = `${t("front.contact.title")}`;
    siteTags.description = t("front.contact.headline");
  } else if (slug === "/newsletter") {
    siteTags.title = `${t("front.newsletter.title")}`;
    siteTags.description = t("front.newsletter.headline");
  } else if (slug === "/changelog") {
    siteTags.title = `${t("front.changelog.title")}`;
    siteTags.description = t("front.changelog.headline");
  }
  return parseMetaTags(siteTags);
}

function parseMetaTags(tags: typeof siteTags): MetaTagsDto {
  return [
    { title: tags.title },
    { name: "description", content: tags.description },
    { name: "keywords", content: tags.keywords },
    { name: "og:title", content: tags.title },
    { name: "og:type", content: "website" },
    { name: "og:image", content: tags.image },
    { name: "og:card", content: "summary_large_image" },
    { name: "og:description", content: tags.description },
    { name: "twitter:image", content: tags.thumbnail },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:creator", content: tags.twitterCreator ?? "" },
    { name: "og:creator", content: tags.twitterCreator },
    { name: "twitter:site", content: tags.twitterSite ?? "" },
    { name: "twitter:title", content: tags.title },
    { name: "twitter:description", content: tags.description },
  ];
}
