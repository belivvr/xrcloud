# Project Introduction (English)  |  [한글](./README_ko.md)
* This project is an open-source project called XRCLOUD, which was developed by forking the [Hubs](https://github.com/Hubs-Foundation) project from [BELIVVR](https://belivvr.com). The goal was to develop additional features and provide resources of Hubs Rooms and Scenes as a membership-based cloud service.
* As of February 2025, BELIVVR has decided not to continue further development due to business challenges and has released it as open source.
* This is a detailed documentation service for partners who have been provided with development services, and it aims to contribute to the web metaverse open-source ecosystem, albeit in a small way.
* Please note that we did not have the capacity to send separate PRs to HubsFoundation, and the XRCLOUD service has secured servers that can be operated until September 2025, but there are no confirmed plans for the service thereafter. Technical support will be provided to partners who have been promised service until December 2025.
* For further inquiries, please contact the former CEO of BELIVVR, Byungseok Yang (fstory97@gmail.com).

# Installation and Operation
* This project has dependencies on multiple subRepository projects. The XRCLOUD project follows the same license, and projects forked from hubsFoundation follow the licenses of their original projects.
* For detailed installation and operation methods, please refer to the [Installation and Operation Guide](./docs/installation_guide_en.md).

# License and Patents
* Subprojects including hubs follow the licenses of their original projects.
* XRCLOUD follows the Apache License 2.0.
* Patent Notice:
  - The use of this software does not grant any rights to BELIVVR's patents.
  - While this software is released under the Apache 2.0 License, this license does not provide complete immunity from patent claims.
  - BELIVVR holds several patents related to certain functionalities within this system.
  - Separate patent licenses may be required for commercial use of features covered by these patents.
  - For patent licensing inquiries, please contact: fstory97@gmail.com
* For complete license and patent information, please refer to the LICENSE and NOTICE files.

# Frameworks Used in XRCLOUD
* XRCLOUD-BACKEND: Nest.js, Node.js, PostgreSQL, Docker, REDIS
* XRCLOUD-FRONTEND: Next.js, React, TypeScript, Docker

# Key Features and Characteristics
* XRCLOUD is a fork project of hubs and provides the basic features of hubs. It does not use the admin project of hubs, allowing various users to use one admin account of hubs through XRCLOUD, managing the resources of hubs through XRCLOUD.

## Differential Management by Membership Level (xrcloud)
* It is possible to set different levels for 3rd party developers and provide differentiated services through subscription management.

<img src="./docs/images/price_plan.png" alt="XRCLOUD service tier system">

* The XRCLOUD project aimed to expand the features of hubs to provide differentiated features and a membership-based cloud service.
* It is possible to limit the number of entries in a room and the number of scenes and rooms that can be created.
* A separate management tool was not developed, and upon registration, users are set to the default Tier, and upgrades to additional Tiers must be done in the database.
* Storage limitations and payment-related features are not implemented.

## Dashboard Service for Developers (xrcloud)
* Provides a dashboard service for managing members, projects, scene management corresponding to the web editor of the metaverse space, and room management corresponding to the metaverse space instance for 3rd party developers.

<img src="./docs/images/xrcloud_dashboard.png" alt="XRCLOUD service dashboard">

## OpenAPI Service for Developers (xrcloud)
* Provides APIs for managing projects, scenes, and rooms for 3rd party developers. For API details, please refer to the [XRCLOUD API Documentation](https://github.com/belivvr/xrcloud-backend/blob/main/docs/api/en/api.md).
* Provides APIs related to 3rd party members, allowing the creation of a creative platform through separate user management on the 3rd party developer's platform.
* It is possible to give differentiated permissions by dividing host and guest users.
* It is possible to generate expiring private URLs and continuously public URLs.

<img src="./docs/images/xrcloud_api.png" alt="XRCLOUD service Open API">

## Medium Blog RSS Page Rendering Feature (xrcloud)
* It is possible to display the managed Medium blog within the service.

<img src="./docs/images/xrcloud_medium.png" alt="XRCLOUD service Medium blog RSS">

## Room Logging and Event Hooks (xrcloud)
* Added room logging and event hook features to XRCLOUD's custom hubs (hubs-all-in-one).
  * Room Logging: Logs events such as room entry, exit, and movement.
  * Event Hooks: Hooks events such as room entry, exit, and movement to deliver them externally.
  * It is possible to set a hook URL per project.

<img src="./docs/images/xrcloud_roomlog.png" alt="XRCLOUD service logging">

## Full-body Avatar (hubs)
* Supports [BELIVVR's open-source full-body avatar editor](https://github.com/belivvr/xrcloud-avatar-editor).
  * This avatar project is not designed considering Bit-ecs, so it does not support all features of Hubs.

<img src="./docs/images/xrcloud_fullbody.png" alt="XRCLOUD service full-body avatar">

## Jump (hubs)
* Pressing the J key in desktop mode makes the avatar jump.
  * Note: The full-body avatar resets the y-value to the ground when jumping, so it cannot jump.

<img src="./docs/images/hubs_jump.png" alt="hubs jump improvement">

## Third-person Free View Feature (hubs)
* Supports third-person view in desktop mode, with the camera positioned behind the avatar and adjustable camera position. When moving, the camera rotates behind the avatar's head to match the avatar's perspective.
  * There is a somewhat unnatural aspect due to the roll operation in the third-person free view. This part was not improved due to time constraints.

<img src="./docs/images/hubs_third_view.png" alt="hubs third-person free view">

## Avatar Change Feature Set by URL on Entry (hubs)
* It is possible to change the avatar through URL query parameters.

## Fast Entry (hubs)
* Allows immediate entry by skipping the device and avatar setting modal window.
```
# Avatar Setting & fastEntry use example
https://room.xrcloud.app:4000/qkoCp3x/test2?public=04f740f3-b96f-43da-90da-5c99d64e2364%
avatarUrl=https://belivvr.github.io/files/Avatars/VVRI_SD_Ani_Ribbon_ReAnimaion_04.glb&
&displayName=VVRI
&funcs=fastEntry
```

<img src="./docs/images/hubs_fastEntry.png" alt="hubs fast entry">

## Inline Frame/View Component (Spoke/hubs)
* A component similar to the link component but with enhanced features.
* **iframe-based content view**: A custom Spoke component by BELIVVR that can display content in the 3D main view of Hubs, chat sidebar, its own window, or a new window.
  * XRCLOUD's privateURL can pre-deliver data when generating the URL, allowing different content to be displayed for each user.

    <img src="./docs/images/hubs_inlineFrame_sideView.png" alt="Button text change">

* **Button Text Customization**: Unlike the link component, users can modify the button text.

    <img src="./docs/images/spoke_inline_view_button_text.png" alt="Button text change">

* **Avatar Change Feature**: It is possible to include avatar settings in the target URL and change them upon click.
  * When used with the mirror component of Spoke, it is possible to implement features such as an avatar shop.
  
  <img src="./docs/images/spoke_inline_view_avatar.png" alt="Avatar change">

* **Proximity Trigger**: Automatically activates within a specified distance.
  * When used with the avatar change feature, it is possible to enforce the use of a specific avatar in a specific room.
  
   <img src="./docs/images/spoke_inline_view_trigger_distance.png" alt="Proximity trigger">

* **Room Transition Without Refresh**: Supports room transitions without refresh, similar to the link component.
  * When used with the proximity trigger, it is possible to implement a natural portal transition feature that moves to another room at a specific location.

## Applied Cases
* For detailed pages on applied cases, please refer to [Applied Cases](./docs/applied_cases_en.md).
* [CNU Metaversity (Chonnam National University Metaverse)](https://cnumeta.jnu.ac.kr/): A virtual campus developed since 2022, offering student creation features, personal spaces using template rooms, metaverse creation competitions, and metaverse graduation and entrance ceremonies. This project received the most help in its development.
* [Meta Track](https://meta-track.kr): A metaverse education platform completed in 2024, allowing teachers to create classes and register metaverse classes and attendance by matching with subject-specific metaverse spaces created by administrators.
* [ClassV](https://classv.school/ko): A metaverse education program operation platform developed by BELIVVR, allowing class creation and sharing of student-created content.
* [Suncheon Eco Net](https://suncheoneco.net/ko/): A metaverse platform for Suncheon city, showcasing the ecological environment of Suncheon Bay and providing materials for children's environmental education programs using the metaverse.
 
 ## Available Space (Scene/Spoke) Data Release
 * For space (Scene/Spoke) data available according to CCL, please refer to [Space Resources](./docs/spoke_files/README.md).
 
## Additional Technical Inquiries
* For additional technical inquiries, please contact the former CEO of BELIVVR, Luke Yang (fstory97@gmail.com).
