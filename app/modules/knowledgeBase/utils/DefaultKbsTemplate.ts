import { KnowledgeBasesTemplateDto } from "../dtos/KnowledgeBasesTemplateDto";

const SAMPLE: KnowledgeBasesTemplateDto = {
  knowledgeBases: [
    {
      basePath: "/",
      slug: "docs",
      title: "Docs",
      description: "",
      defaultLanguage: "en",
      layout: "list",
      color: 15,
      enabled: true,
      languages: ["en"],
      links: [],
      logo: "dark",
      seoImage: "",
    },
    {
      basePath: "/help",
      slug: "center",
      title: "Help Center",
      description: "",
      defaultLanguage: "en",
      layout: "articles",
      color: 16,
      enabled: true,
      languages: ["en", "es"],
      links: [
        {
          name: "Back to site",
          href: "/",
          order: 1,
        },
      ],
      logo: "dark",
      seoImage: "",
    },
  ],
  categories: [
    {
      knowledgeBaseSlug: "docs",
      slug: "introduction",
      order: 1,
      title: "Introduction",
      description: "Introduction category description sample",
      icon: "",
      language: "en",
      seoImage: "",
      sections: [],
    },
    {
      knowledgeBaseSlug: "center",
      slug: "category-1",
      order: 1,
      title: "Category 1",
      description: "Description from category one",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="50" height="50" viewBox="0 0 50 50" className={className} fill="currentColor">       <path d="M47.16,21.221l-5.91-0.966c-0.346-1.186-0.819-2.326-1.411-3.405l3.45-4.917c0.279-0.397,0.231-0.938-0.112-1.282 l-3.889-3.887c-0.347-0.346-0.893-0.391-1.291-0.104l-4.843,3.481c-1.089-0.602-2.239-1.08-3.432-1.427l-1.031-5.886 C28.607,2.35,28.192,2,27.706,2h-5.5c-0.49,0-0.908,0.355-0.987,0.839l-0.956,5.854c-1.2,0.345-2.352,0.818-3.437,1.412l-4.83-3.45 c-0.399-0.285-0.942-0.239-1.289,0.106L6.82,10.648c-0.343,0.343-0.391,0.883-0.112,1.28l3.399,4.863 c-0.605,1.095-1.087,2.254-1.438,3.46l-5.831,0.971c-0.482,0.08-0.836,0.498-0.836,0.986v5.5c0,0.485,0.348,0.9,0.825,0.985 l5.831,1.034c0.349,1.203,0.831,2.362,1.438,3.46l-3.441,4.813c-0.284,0.397-0.239,0.942,0.106,1.289l3.888,3.891 c0.343,0.343,0.884,0.391,1.281,0.112l4.87-3.411c1.093,0.601,2.248,1.078,3.445,1.424l0.976,5.861C21.3,47.647,21.717,48,22.206,48 h5.5c0.485,0,0.9-0.348,0.984-0.825l1.045-5.89c1.199-0.353,2.348-0.833,3.43-1.435l4.905,3.441 c0.398,0.281,0.938,0.232,1.282-0.111l3.888-3.891c0.346-0.347,0.391-0.894,0.104-1.292l-3.498-4.857 c0.593-1.08,1.064-2.222,1.407-3.408l5.918-1.039c0.479-0.084,0.827-0.5,0.827-0.985v-5.5C47.999,21.718,47.644,21.3,47.16,21.221z M25,32c-3.866,0-7-3.134-7-7c0-3.866,3.134-7,7-7s7,3.134,7,7C32,28.866,28.866,32,25,32z"></path>     </svg>',
      language: "en",
      seoImage: "",
      sections: [],
    },
    {
      knowledgeBaseSlug: "center",
      slug: "categoria-1",
      order: 1,
      title: "Categoría 1",
      description: "Descripción de categoría uno",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="50" height="50" viewBox="0 0 50 50" className={className} fill="currentColor">       <path d="M47.16,21.221l-5.91-0.966c-0.346-1.186-0.819-2.326-1.411-3.405l3.45-4.917c0.279-0.397,0.231-0.938-0.112-1.282 l-3.889-3.887c-0.347-0.346-0.893-0.391-1.291-0.104l-4.843,3.481c-1.089-0.602-2.239-1.08-3.432-1.427l-1.031-5.886 C28.607,2.35,28.192,2,27.706,2h-5.5c-0.49,0-0.908,0.355-0.987,0.839l-0.956,5.854c-1.2,0.345-2.352,0.818-3.437,1.412l-4.83-3.45 c-0.399-0.285-0.942-0.239-1.289,0.106L6.82,10.648c-0.343,0.343-0.391,0.883-0.112,1.28l3.399,4.863 c-0.605,1.095-1.087,2.254-1.438,3.46l-5.831,0.971c-0.482,0.08-0.836,0.498-0.836,0.986v5.5c0,0.485,0.348,0.9,0.825,0.985 l5.831,1.034c0.349,1.203,0.831,2.362,1.438,3.46l-3.441,4.813c-0.284,0.397-0.239,0.942,0.106,1.289l3.888,3.891 c0.343,0.343,0.884,0.391,1.281,0.112l4.87-3.411c1.093,0.601,2.248,1.078,3.445,1.424l0.976,5.861C21.3,47.647,21.717,48,22.206,48 h5.5c0.485,0,0.9-0.348,0.984-0.825l1.045-5.89c1.199-0.353,2.348-0.833,3.43-1.435l4.905,3.441 c0.398,0.281,0.938,0.232,1.282-0.111l3.888-3.891c0.346-0.347,0.391-0.894,0.104-1.292l-3.498-4.857 c0.593-1.08,1.064-2.222,1.407-3.408l5.918-1.039c0.479-0.084,0.827-0.5,0.827-0.985v-5.5C47.999,21.718,47.644,21.3,47.16,21.221z M25,32c-3.866,0-7-3.134-7-7c0-3.866,3.134-7,7-7s7,3.134,7,7C32,28.866,28.866,32,25,32z"></path>     </svg>',
      language: "es",
      seoImage: "",
      sections: [
        {
          order: 1,
          title: "Sección 1",
          description: "",
        },
      ],
    },
    {
      knowledgeBaseSlug: "center",
      slug: "categoria-2",
      order: 2,
      title: "Categoría 2",
      description: "Descripción de categoría dos",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">       <path         fillRule="evenodd"         d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"         clipRule="evenodd"       />     </svg>',
      language: "es",
      seoImage: "",
      sections: [],
    },
    {
      knowledgeBaseSlug: "center",
      slug: "category-2",
      order: 2,
      title: "Category 2",
      description: "Description from category two",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">       <path         fillRule="evenodd"         d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"         clipRule="evenodd"       />     </svg>',
      language: "en",
      seoImage: "",
      sections: [],
    },
  ],
  articles: [
    {
      knowledgeBaseSlug: "docs",
      categorySlug: "introduction",
      categorySectionOrder: null,
      slug: "saasrock-v0.8.9-knowledge-base",
      title: "SaasRock v0.8.9 - Knowledge Base",
      description: "",
      order: 0,
      contentDraft:
        '<p></p><p>Watch the demo video: <a target="_blank" rel="noopener noreferrer nofollow" class="text-stone-600 underline underline-offset-[3px] hover:text-stone-700 transition-colors cursor-pointer text-stone-600 underline underline-offset-[3px] hover:text-stone-700 transition-colors cursor-pointer" href="https://www.loom.com/share/85f9fdc37ae84896af52a3ba79952c01?sid=34b5db31-01d6-47d1-ace7-68d143c1d285"><span style="color: rgb(33, 33, 33)">https://www.loom.com/share/85f9fdc37ae84896af52a3ba79952c01?sid=34b5db31-01d6-47d1-ace7-68d143c1d285</span></a></p>',
      contentPublished:
        '<p></p><p>Watch the demo video: <a target="_blank" rel="noopener noreferrer nofollow" class="text-stone-600 underline underline-offset-[3px] hover:text-stone-700 transition-colors cursor-pointer text-stone-600 underline underline-offset-[3px] hover:text-stone-700 transition-colors cursor-pointer" href="https://www.loom.com/share/85f9fdc37ae84896af52a3ba79952c01?sid=34b5db31-01d6-47d1-ace7-68d143c1d285"><span style="color: rgb(33, 33, 33)">https://www.loom.com/share/85f9fdc37ae84896af52a3ba79952c01?sid=34b5db31-01d6-47d1-ace7-68d143c1d285</span></a></p>',
      contentPublishedAsText:
        "Watch the demo video: https://www.loom.com/share/85f9fdc37ae84896af52a3ba79952c01?sid=34b5db31-01d6-47d1-ace7-68d143c1d285\n[https://www.loom.com/share/85f9fdc37ae84896af52a3ba79952c01?sid=34b5db31-01d6-47d1-ace7-68d143c1d285]",
      contentType: "wysiwyg",
      language: "en",
      featuredOrder: 2,
      seoImage: "",
      publishedAt: "2023-07-01T23:42:31.371Z",
      createdByUserEmail: "alex.martinez@absys.com.mx",
      relatedArticles: [],
    },
    {
      knowledgeBaseSlug: "docs",
      categorySlug: "introduction",
      categorySectionOrder: null,
      slug: "dynamic-vs-static-knowledge-bases",
      title: "Dynamic vs Static Knowledge Bases",
      description: "Learn how the new Knowledge Base feature works.",
      order: 0,
      contentDraft:
        '<h3><strong>Static Knowledge Base</strong></h3><p>This /docs knowledge base is "static", meaning there are the following route files:</p><ul class="list-disc list-outside leading-3"><li class="leading-normal"><p><code class="rounded-md bg-stone-200 px-1.5 py-1 font-mono font-medium text-black">app/routes/docs/($lang).tsx</code></p></li><li class="leading-normal"><p><code class="rounded-md bg-stone-200 px-1.5 py-1 font-mono font-medium text-black">app/routes/docs/($lang).categories.$category.tsx</code></p></li><li class="leading-normal"><p><code class="rounded-md bg-stone-200 px-1.5 py-1 font-mono font-medium text-black">app/routes/docs/($lang).articles.$article.tsx</code></p></li></ul><p>And the knowledge base <code class="rounded-md bg-stone-200 px-1.5 py-1 font-mono font-medium text-black">slug</code> is manually set. This means, there needs to be a knowledge base created with the <code class="rounded-md bg-stone-200 px-1.5 py-1 font-mono font-medium text-black">knowlegeBase.slug = "docs"</code> and the <code class="rounded-md bg-stone-200 px-1.5 py-1 font-mono font-medium text-black">knowlegeBase.basePath = "/"</code>.</p><p><strong>app/routes/docs/($lang).tsx</strong>:</p><pre class="rounded-sm bg-stone-100 p-5 font-mono font-medium text-stone-800"><code>import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";\nimport KbRoutesIndex from "~/modules/knowledgeBase/routes/views/KbRoutes.Index.View";\nimport { KbRoutesIndexApi } from "~/modules/knowledgeBase/routes/api/KbRoutes.Index.Api";\nimport ServerError from "~/components/ui/errors/ServerError";\n\nexport const meta: V2_MetaFunction = ({ data }) =&gt; data?.metatags;\nexport let loader = (args: LoaderArgs) =&gt; KbRoutesIndexApi.loader(args, {\n  kbSlug: "docs"\n});\n\nexport default () =&gt; &lt;KbRoutesIndex /&gt;;\n\nexport function ErrorBoundary() {\n  return &lt;ServerError /&gt;;\n}</code></pre><h3><strong>Dynamic Knowledge Bases</strong></h3><p>For all other knowledge bases, the <code class="rounded-md bg-stone-200 px-1.5 py-1 font-mono font-medium text-black">basePath</code> needs to be <code class="rounded-md bg-stone-200 px-1.5 py-1 font-mono font-medium text-black">/help</code>. And if you need a Help Center knowledge base, you would set the <code class="rounded-md bg-stone-200 px-1.5 py-1 font-mono font-medium text-black">slug</code> as <code class="rounded-md bg-stone-200 px-1.5 py-1 font-mono font-medium text-black">center</code>. This will result in a <code class="rounded-md bg-stone-200 px-1.5 py-1 font-mono font-medium text-black">/help/center</code> route for the knowledge base.</p><p>You can change the hard-coded <code class="rounded-md bg-stone-200 px-1.5 py-1 font-mono font-medium text-black">docs</code> and <code class="rounded-md bg-stone-200 px-1.5 py-1 font-mono font-medium text-black">help</code> directories to fit your knowledge base needs.</p>',
      contentPublished:
        '<h3><strong>Static Knowledge Base</strong></h3><p>This /docs knowledge base is "static", meaning there are the following route files:</p><ul class="list-disc list-outside leading-3"><li class="leading-normal"><p><code class="rounded-md bg-stone-200 px-1.5 py-1 font-mono font-medium text-black">app/routes/docs/($lang).tsx</code></p></li><li class="leading-normal"><p><code class="rounded-md bg-stone-200 px-1.5 py-1 font-mono font-medium text-black">app/routes/docs/($lang).categories.$category.tsx</code></p></li><li class="leading-normal"><p><code class="rounded-md bg-stone-200 px-1.5 py-1 font-mono font-medium text-black">app/routes/docs/($lang).articles.$article.tsx</code></p></li></ul><p>And the knowledge base <code class="rounded-md bg-stone-200 px-1.5 py-1 font-mono font-medium text-black">slug</code> is manually set. This means, there needs to be a knowledge base created with the <code class="rounded-md bg-stone-200 px-1.5 py-1 font-mono font-medium text-black">knowlegeBase.slug = "docs"</code> and the <code class="rounded-md bg-stone-200 px-1.5 py-1 font-mono font-medium text-black">knowlegeBase.basePath = "/"</code>.</p><p><strong>app/routes/docs/($lang).tsx</strong>:</p><pre class="rounded-sm bg-stone-100 p-5 font-mono font-medium text-stone-800"><code>import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";\nimport KbRoutesIndex from "~/modules/knowledgeBase/routes/views/KbRoutes.Index.View";\nimport { KbRoutesIndexApi } from "~/modules/knowledgeBase/routes/api/KbRoutes.Index.Api";\nimport ServerError from "~/components/ui/errors/ServerError";\n\nexport const meta: V2_MetaFunction = ({ data }) =&gt; data?.metatags;\nexport let loader = (args: LoaderArgs) =&gt; KbRoutesIndexApi.loader(args, {\n  kbSlug: "docs"\n});\n\nexport default () =&gt; &lt;KbRoutesIndex /&gt;;\n\nexport function ErrorBoundary() {\n  return &lt;ServerError /&gt;;\n}</code></pre><h3><strong>Dynamic Knowledge Bases</strong></h3><p>For all other knowledge bases, the <code class="rounded-md bg-stone-200 px-1.5 py-1 font-mono font-medium text-black">basePath</code> needs to be <code class="rounded-md bg-stone-200 px-1.5 py-1 font-mono font-medium text-black">/help</code>. And if you need a Help Center knowledge base, you would set the <code class="rounded-md bg-stone-200 px-1.5 py-1 font-mono font-medium text-black">slug</code> as <code class="rounded-md bg-stone-200 px-1.5 py-1 font-mono font-medium text-black">center</code>. This will result in a <code class="rounded-md bg-stone-200 px-1.5 py-1 font-mono font-medium text-black">/help/center</code> route for the knowledge base.</p><p>You can change the hard-coded <code class="rounded-md bg-stone-200 px-1.5 py-1 font-mono font-medium text-black">docs</code> and <code class="rounded-md bg-stone-200 px-1.5 py-1 font-mono font-medium text-black">help</code> directories to fit your knowledge base needs.</p>',
      contentPublishedAsText:
        'STATIC KNOWLEDGE BASE\n\nThis /docs knowledge base is "static", meaning there are the following route files:\n\n * app/routes/docs/($lang).tsx\n\n * app/routes/docs/($lang).categories.$category.tsx\n\n * app/routes/docs/($lang).articles.$article.tsx\n\nAnd the knowledge base slug is manually set. This means, there needs to be a knowledge base created with the knowlegeBase.slug =\n"docs" and the knowlegeBase.basePath = "/".\n\napp/routes/docs/($lang).tsx:\n\nimport type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";\nimport KbRoutesIndex from "~/modules/knowledgeBase/routes/views/KbRoutes.Index.View";\nimport { KbRoutesIndexApi } from "~/modules/knowledgeBase/routes/api/KbRoutes.Index.Api";\nimport ServerError from "~/components/ui/errors/ServerError";\n\n\n\nexport const meta: V2_MetaFunction = ({ data }) => data?.metatags;\nexport let loader = (args: LoaderArgs) => KbRoutesIndexApi.loader(args, {\n  kbSlug: "docs"\n});\n\n\nexport default () => <KbRoutesIndex />;\n\n\nexport function ErrorBoundary() {\n  return <ServerError />;\n}\n\n\nDYNAMIC KNOWLEDGE BASES\n\nFor all other knowledge bases, the basePath needs to be /help. And if you need a Help Center knowledge base, you would set the\nslug as center. This will result in a /help/center route for the knowledge base.\n\nYou can change the hard-coded docs and help directories to fit your knowledge base needs.\n\n',
      contentType: "wysiwyg",
      language: "en",
      featuredOrder: 1,
      seoImage: "",
      publishedAt: "2023-07-01T21:49:40.834Z",
      createdByUserEmail: "alex.martinez@absys.com.mx",
      relatedArticles: [],
    },
    {
      knowledgeBaseSlug: "center",
      categorySlug: "categoria-1",
      categorySectionOrder: 1,
      slug: "ejemplo-2",
      title: "Ejemplo 2",
      description: "Descripción de ejemplo número dos",
      order: 0,
      contentDraft: "<p>Ejemplo 2</p>",
      contentPublished: "<p>Ejemplo 2</p>",
      contentPublishedAsText: "Ejemplo 2",
      contentType: "wysiwyg",
      language: "es",
      featuredOrder: 3,
      seoImage: "",
      publishedAt: "2023-07-01T21:39:51.857Z",
      createdByUserEmail: "alex.martinez@absys.com.mx",
      relatedArticles: [],
    },
    {
      knowledgeBaseSlug: "center",
      categorySlug: "category-1",
      categorySectionOrder: null,
      slug: "sample-2",
      title: "Sample 2",
      description: "Sample description number two",
      order: 0,
      contentDraft: "<p>Sample 2</p><p></p><p>asdfasdfasdfdasfasdf</p>",
      contentPublished: "<p>Sample 2</p><p></p><p>asdfasdfasdfdasfasdf</p>",
      contentPublishedAsText: "Sample 2\n\n\n\nasdfasdfasdfdasfasdf",
      contentType: "wysiwyg",
      language: "en",
      featuredOrder: 2,
      seoImage: "",
      publishedAt: "2023-07-01T23:35:32.524Z",
      createdByUserEmail: "alex.martinez@absys.com.mx",
      relatedArticles: [
        {
          slug: "sample-1",
        },
        {
          slug: "sample-3",
        },
      ],
    },
    {
      knowledgeBaseSlug: "center",
      categorySlug: "category-1",
      categorySectionOrder: null,
      slug: "sample-1",
      title: "Sample 1",
      description: "Sample description number one",
      order: 0,
      contentDraft: "<p>Sample</p>",
      contentPublished: "<p>Sample</p>",
      contentPublishedAsText: "Sample",
      contentType: "wysiwyg",
      language: "en",
      featuredOrder: 1,
      seoImage: "",
      publishedAt: "2023-07-01T21:39:38.696Z",
      createdByUserEmail: "alex.martinez@absys.com.mx",
      relatedArticles: [],
    },
    {
      knowledgeBaseSlug: "center",
      categorySlug: "categoria-1",
      categorySectionOrder: null,
      slug: "ejemplo-1",
      title: "Ejemplo 1",
      description: "Descripción de ejemplo número uno",
      order: 0,
      contentDraft: "<p>Ejemplo 1</p>",
      contentPublished: "<p>Ejemplo 1</p>",
      contentPublishedAsText: "Ejemplo 1",
      contentType: "wysiwyg",
      language: "es",
      featuredOrder: 3,
      seoImage: "",
      publishedAt: "2023-07-01T21:39:49.570Z",
      createdByUserEmail: "alex.martinez@absys.com.mx",
      relatedArticles: [],
    },
    {
      knowledgeBaseSlug: "center",
      categorySlug: "categoria-2",
      categorySectionOrder: null,
      slug: "ejemplo-3",
      title: "Ejemplo 3",
      description: "Descripción de ejemplo número tres",
      order: 0,
      contentDraft: "<p>Ejemplo 3</p>",
      contentPublished: "<p>Ejemplo 3</p>",
      contentPublishedAsText: "Ejemplo 3",
      contentType: "wysiwyg",
      language: "es",
      featuredOrder: null,
      seoImage: "",
      publishedAt: "2023-07-01T21:39:47.550Z",
      createdByUserEmail: "alex.martinez@absys.com.mx",
      relatedArticles: [],
    },
    {
      knowledgeBaseSlug: "center",
      categorySlug: "category-2",
      categorySectionOrder: null,
      slug: "sample-3",
      title: "Sample 3",
      description: "Sample description number three",
      order: 0,
      contentDraft: "<p>Sample 3</p>",
      contentPublished: "<p>Sample 3</p>",
      contentPublishedAsText: "Sample 3",
      contentType: "wysiwyg",
      language: "en",
      featuredOrder: null,
      seoImage: "",
      publishedAt: "2023-07-01T21:39:36.515Z",
      createdByUserEmail: "alex.martinez@absys.com.mx",
      relatedArticles: [],
    },
  ],
};

export default {
  SAMPLE,
};
