<b>Want a campaign to go live at midnight? At SmartSaver, someone had to deploy it at midnight.</b>

Even changing a banner image or translation meant a development ticket, QA and a manual release. A straightforward update could take <b>1–3 days</b>. I wanted Growth to be able to run a campaign without an engineer.

So I designed a self-service Banner System. With assets and translations ready, our teams could create, preview, target and schedule a campaign in <b>minutes</b>.

<columns>
<column ratio="33">
<callout icon="⚡" color="gray_bg">
## <b>1–3 days → minutes</b>

Campaign launch time
</callout>
</column>
<column ratio="33">
<callout icon="🎯" color="gray_bg">
## <b>No dev tickets</b>

For routine campaign changes
</callout>
</column>
<column ratio="34">
<callout icon="🧩" color="gray_bg">
## <b>One service</b>

For web, iOS and Android
</callout>
</column>
</columns>

<b>My role:</b> Senior Product Manager and sole product lead. I initiated the work, defined the requirements, built a working admin prototype with ChatGPT and worked with two backend engineers, a frontend engineer and UX on delivery.

## How did a banner become a development project?

SmartSaver had one web banner placement, showing one banner at a time. Everyone saw it unless Growth worked with analysts to prepare a CSV of customer IDs.

Changing images or translations meant involving developers and QA. Longer translations could break layouts. And a campaign scheduled for midnight needed somebody to release it manually.

This felt like an enormous amount of coordination for something Growth should be able to manage themselves.

## Give Growth the controls

I designed the administration workflow from scratch and made a clickable prototype before development to communicate my thinking. The team could explore how it should work rather than guess from a requirements document.

The essentials were:

- <b>Content and localization.</b> Different copy and images per language, with English as a fallback.
- <b>Preview.</b> Check languages, light and dark themes, and customer destinations before publishing.
- <b>Scheduling.</b> Draft, launch, stop or set precise start and end times.
- <b>Performance.</b> See views, clicks and CTR alongside campaign status.

We organized the system by <b>products, placements and up to three ordered slots per placement</b>. That gave us room to add more surfaces without rebuilding the tool.

<image source="notion-file-block://cd7cc3fc-dfbd-4266-baa6-ee73cb680e04/48049aa7-bbd7-4277-8a90-e6b4e19f6d02?space_id=65f780ce-7ac1-4bdd-99ac-9b9c64d4ac51&name=bs-system-model.jpg" />

<image source="notion-file-block://393f6d62-fb91-41f0-9a1f-7be0fbea607d/9eb79e2b-c5f3-414b-b311-0dabe33a0fe2?space_id=65f780ce-7ac1-4bdd-99ac-9b9c64d4ac51&name=bs-mobile-home-main.jpg" />

<i>The placement and slot model, and the actual administration interface.</i>

<toggle>
Explore scheduling, localization and preview

<image source="notion-file-block://695d8ade-3eda-4dd6-951a-89d667034704/2907b72b-cdc1-4ee4-ad5a-cb808470d39c?space_id=65f780ce-7ac1-4bdd-99ac-9b9c64d4ac51&name=bs-main-settings.jpg" />

<image source="notion-file-block://33c329f0-c09a-4277-8db7-8b8175fc71c6/8cf611ae-2023-4b5d-bb20-02961dc85090?space_id=65f780ce-7ac1-4bdd-99ac-9b9c64d4ac51&name=bs-localisation.jpg" />

<image source="notion-file-block://dbf2df61-9d08-4ce6-98a4-9b5a0f33765d/ee3f490b-4dec-4941-86b8-3db7b933c34b?space_id=65f780ce-7ac1-4bdd-99ac-9b9c64d4ac51&name=bs-preview.jpg" />
</toggle>

## Then we made it reusable

I proposed building the capability as an independent service. The engineers delivered <b>SmartSaver's first Node.js microservice</b>, with an API that served the right banner to web and mobile clients.

I also deliberately split the work into releases. The first version solved campaign creation and scheduling. <b>Rules-based targeting came next</b>, replacing manually assembled CSV lists with conditions such as account template, balance, verification age, referral campaign and Vault history.

<image source="notion-file-block://2cefd4e4-63b0-4c15-b871-867abdda4cac/1f539ca4-26cd-4875-9232-7acdc5cf621c?space_id=65f780ce-7ac1-4bdd-99ac-9b9c64d4ac51&name=bs-targeting.jpg" />

<i>Targeting rules added after the initial release.</i>

When the native apps launched in September 2026, they used the same service from day one. We added three independent Home placements (Main, Wealth and Vault), in-app destinations and dark-mode variants.

<columns>
<column ratio="50">
<image source="notion-file-block://288ee332-d44a-4603-9238-a3e1451afc6b/c24a28ff-0404-473e-9f4a-0aa38ff8f0fd?space_id=65f780ce-7ac1-4bdd-99ac-9b9c64d4ac51&name=banners-customer-web-summary.png" />

<i>Banner on the web Summary page.</i>
</column>
<column ratio="50">
<image source="notion-file-block://3bbb6525-4af6-4026-bbf6-c4d1dc7a5a33/5ad3177e-2cbf-432d-9637-966ed24293b2?space_id=65f780ce-7ac1-4bdd-99ac-9b9c64d4ac51&name=banners-customer-mobile-wealth.png" />

<i>Banner in the native app's Wealth section.</i>
</column>
</columns>

<toggle>
More admin views: placements and performance

<image source="notion-file-block://0d2960ac-69a7-4be0-81f2-91df55c1840f/31890059-9b9a-435b-8f7a-bbcdfa413c16?space_id=65f780ce-7ac1-4bdd-99ac-9b9c64d4ac51&name=bs-mobile-home-vault.jpg" />

<image source="notion-file-block://51748009-191c-4c19-ac12-eff8462ad250/a4da1e41-9b6b-4b64-956f-622df1a3637a?space_id=65f780ce-7ac1-4bdd-99ac-9b9c64d4ac51&name=bs-desktop-summary.jpg" />
</toggle>

## What changed?

Growth and Operations could publish or schedule campaigns in minutes, handle translations and targeting themselves, and check performance in the same admin. Routine banner updates no longer took engineering and QA time.

The service was ready for other Creditstar products, although <b>SmartSaver remained its only production user</b> when I left.

This is one of my favourite projects because the original problem was so ordinary. We built a proper product around it, gave the right people control and freed up engineering for more interesting work.

And yes, campaigns could finally go live at midnight without anyone deploying them at midnight.
