<b>A partner agreement said some customers couldn't refer friends. The easy fix? Another hardcoded exception. I had a different idea.</b>

At SmartSaver, different rates, bonuses and permissions kept turning into special cases in the code. Even a small commercial change needed a developer. I built <b>Account Templates -</b> a system that would let the business configure customer accounts itself.

<columns>
<column ratio="33">
<callout icon="🧩" color="gray_bg">
## <b>2 → \~40+</b>

Templates, from launch to my departure
</callout>
</column>
<column ratio="33">
<callout icon="⚡" color="gray_bg">
## <b>Minutes</b>

To configure a new customer group
</callout>
</column>
<column ratio="34">
<callout icon="🛠️" color="gray_bg">
## <b>\~2 months</b>

To ship the first version
</callout>
</column>
</columns>

<b>My role:</b> Senior Product Manager. I initiated the project, designed the template model and its relationships, and led delivery with engineering. Nobody had asked me to build this.

## One problem after another

One partner's customers weren't allowed to refer friends. Our own employees needed 8.33% APY instead of usual 7.5%. Other groups had their own bonuses and permissions.

Each request meant another exception. We had already seen customers receive wrong rates or access features they shouldn't. I wanted to stop adding to that mess.

<toggle>
What the old setup looked like

<image source="notion-file-block://d6376160-9b1a-40bf-8550-dae53998452c/f038fec8-9975-4a69-9f1a-3a4d247025d8?space_id=65f780ce-7ac1-4bdd-99ac-9b9c64d4ac51&name=account-templates-before.svg" />
</toggle>

## One model for every account

The idea was to give each account a template defining its rates, withdrawal options, fees, bonuses and feature permissions.

We launched with two: the default template, and one disabling referrals for the restricted partner group. As SmartSaver evolved, every new feature was added to the same model. Once the foundation was in place, extending it became straightforward for developers.

<image source="notion-file-block://68688232-9cca-41b2-a1d9-a3a35e025326/87dfec01-1d38-4c42-8b5e-00ab8073ed7e?space_id=65f780ce-7ac1-4bdd-99ac-9b9c64d4ac51&name=account-templates-configuration.svg" />

## The tricky part: who gets what?

Designing <b>relationships between templates</b> took the most thought. Imagine a customer on special partner terms inviting a friend. Should that friend inherit the same terms?

I made that behavior configurable:

- <b>Regular referral:</b> default customer invites another default customer.
- <b>Partner referral:</b> a template can pass on its own conditions or point to a different referral template.
- <b>Later extension:</b> cookies and acquisition channels could assign templates even without an individual referrer.

This also helped Marketing and Analytics connect acquired customers and their invested money to the right partners.

<image source="notion-file-block://a8cedf2d-ea35-4a1e-855e-7562a39c4131/88bc3fc0-caf9-40a5-a697-18fb9e21c3c2?space_id=65f780ce-7ac1-4bdd-99ac-9b9c64d4ac51&name=account-templates-relationships.svg" />

## From engineering tickets to self-service

Growth and Operations could now create templates, change conditions and assign customers individually or in bulk. In minutes, without developer involvement.

<image source="notion-file-block://c2a7d23c-3257-44b9-8d27-629f4bb3dfc1/abb4f04f-49cc-4b08-a2db-aa1aba23f950?space_id=65f780ce-7ac1-4bdd-99ac-9b9c64d4ac51&name=account-template-admin-details.svg" />

<i>The actual SmartSaver Admin interface.</i>

<toggle>
Feature settings and change history

<image source="notion-file-block://56c7765b-158f-4df0-9992-f6108047a7e1/80621dec-adca-4da3-a231-c30711ea6ee1?space_id=65f780ce-7ac1-4bdd-99ac-9b9c64d4ac51&name=account-template-admin-features.svg" />
</toggle>

We introduced the system carefully. The old hardcoded logic initially ran alongside it, while the Data team's existing daily health checks continued monitoring financial calculations. The transition avoided the rate and permission errors we were worried about.

## What happened next

- Around <b>40+ templates</b> were in use by my departure, compared with two at launch.
- New features used the established configuration model. Our later <mention url="https://app.notion.com/p/4053732f32cc811eaa3af0d5b177eca6" /> could even target campaigns by account template.
- Acquisition flows became more flexible. I later designed Referral Redirects as a separate initiative; a multiple-accounts approach was another direction I was exploring.

<b>That first partner restriction could have become one more exception.</b> I'm glad I pushed for the bigger fix. Almost two years later, SmartSaver was still adding features to the foundation we'd built.
