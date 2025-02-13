# Installation and Operation Guide (English) | [한글](./installation_guide_ko.md)

# Project Description
* This project is an open-source XRCLOUD project (https://xrcloud.app) that was forked from the [hubs](https://github.com/Hubs-Foundation) project by [BELIVVR](https://belivvr.com). The goal was to develop additional features and provide Hubs' Room and Scene resources as a membership-based cloud service.
* As of February 2025, BELIVVR is releasing this as open source due to business difficulties and has no plans for further development.
* This detailed documentation is for our existing service partners and aims to contribute to the web metaverse open source ecosystem.
* Please note that we did not have the resources to submit PRs to HubsFoundation. While we have secured servers to operate the XRCLOUD service until September 2025, there are no confirmed plans for service beyond that date. We will provide technical support to partners who have been promised service until December 2025.
* For additional inquiries, please contact former BELIVVR CEO Byungseok Yang (fstory97@gmail.com).

# Purpose of This Document
* This guide provides installation and operation instructions for the XRCLOUD project.

# Project Structure and Characteristics
* The hubs-all-in-one project, which modifies the source code of the 3D web open-source metaverse project hubs (https://github.com/Hubs-Foundation), handles hubs functionality.
* The XRCLOUD project is a cloud infrastructure service for managing hubs resources.
* All projects run in Docker containers.
* The system is designed to operate in both dev and prod environments.
* Works on most Linux environments.
* Database is installed directly via Docker, so no external database is required.
* NAS or OSS storage is recommended for expansion and backup purposes.

# Prerequisites
* Linux server environment: Recommended 2+ cores, 4GB+ memory
* Domain: Prepare domains accessible from outside
    - Developed assuming three domains: XRCLOUD service domain, XRCLOUD API server domain, and hubs service domain
    - For single domain usage, nginx settings can be modified
* SSL certificate: Prepare SSL certificates valid for your domains
    - SSL certificates are mandatory as hubs ROOM uses WebRTC services

# Downloading Sub-projects from Git Repository
* Execute the following command to clone necessary git repositories:

```
./initial-git-clone.sh
```
* The downloaded repositories are as follows:

## XRCLOUD Projects
### XRCLOUD Backend Project
* Handles API documentation and backend APIs. Developed with Nest.js framework.
* Repository: https://github.com/belivvr/xrcloud-backend.git

### XRCLOUD Frontend Project
* Handles frontend services like XRCLOUD dashboard. Developed with Next.js framework.
* Repository: https://github.com/belivvr/xrcloud-frontend.git

### XRCLOUD NGINX Project
* Handles XRCLOUD network services. Developed with NGINX, connects external access with internal Docker containers.
* Repository: https://github.com/belivvr/xrcloud-nginx.git

## Hubs Projects
### Hubs All in One Project
* Handles overall installation and operation of Hubs-related Docker containers.
* Creates necessary environment configuration files and handles installation/deployment.
* https://github.com/belivvr/hubs-all-in-one.git

### Dialog Project
* Handles Hubs' WebRTC service, managing user room connections and network relay using SFU method. Based on Mediasoup.
* While horizontal scaling development is limited, it can run on a separate server from the Hubs project to handle user growth.
* https://github.com/belivvr/dialog.git

### Hubs Project
* Handles Hubs' 2D environment and 3D room environment frontend services. Based on A-frame and Bit-ECS.
* Customized to include various features developed by BELIVVR.
* https://github.com/belivvr/hubs.git

### Spoke Project
* 3D web editor service for creating Hubs scenes. Includes features like Inline-View developed by BELIVVR.
* https://github.com/belivvr/spoke.git

### Reticulum Project
* Developed with Phoenix framework using Erlang, manages Hubs connection channels and processes various user events.
* Contains additional code for logging and other features developed by BELIVVR.
* https://github.com/belivvr/reticulum.git

# Installation Method

## Environment Setup
### Docker Installation
* Refer to the [official site](https://docs.docker.com/engine/install/) for Docker installation instructions.

### Required Port Opening
* Services may not connect or run properly if ports are not opened
* 443: SSL port
* 80: HTTP port
* 5000: Thumbnail processing port in Proxy
* 4080: Frontend processing port in Proxy
* 8080: Hubs frontend port (Hubs Client service)
* 9090: Spoke frontend port (Spoke frontend service)
* 8989: Hubs admin service port (not used in this project service but may be accessed if needed)
* 5432: Hubs database (postgres) port
* 4000: Hubs Reticulum port (Hubs connection service)
* 4443: WebRTC port (Dialog service)
* 40000-49999 UTP/TCP: WebRTC ports (Dialog service)

## Hubs All in One Project Installation and Configuration
### Certificate Generation
* Generate certificates for internal server authentication
* This certificate needs to be renewed annually; rerun the command below for renewal
* Creates perms.prv.pem, perms.prv.pem, perms-jwk.json files in the certs folder

```bash
# Generate JWT certificate for PostRest and Docker communication
cd ~/xrcloud/hubs-all-in-one/certs/keygen
bash run.sh
```

### Domain Certificate Copy
* Copy your prepared chain key and private key certificates to ~/hubs-all-in-one/certs folder
    * Certificate paths are added to .gitignore to prevent git tracking
* These file paths must be specified in the .env configuration

### Environment Configuration File Modification
* Copy ~/xrcloud/hubs-all-in-one/.env.sample file to create .env.prod or .env.dev and modify it
* Set the domain certificate paths configured above and modify prepared domain information
* DB_VOLUME_DIR is where the database will be installed. Back up this path if needed
* RETICULUM_STORAGE_DIR is where user data is stored. Can be mounted with NAS or OSS

```bash .env
# Host Information, Domain Information
HUBS_HOST="room.myxrcloud.app"
PROXY_HOST="room.myxrcloud.app"
POSTGREST_HOST="room.myxrcloud.app"
THUMBNAIL_HOST="room.myxrcloud.app"
DB_HOST="room.myxrcloud.app"

# Service Domain Certificate Files 
SSL_CERT_FILE="/home/xrcloud/hubs-all-in-one/certs/myxrcloud.app.crt.pem"
SSL_KEY_FILE="/home/xrcloud/hubs-all-in-one/certs/myxrcloud.app.key.pem"    

# JWT Certificate Files : If not present, generate them by running ./certs/keygen/run.sh command
PERMS_PRV_FILE="/home/xrcloud/hubs-all-in-one/certs/perms.prv.pem"
PERMS_PUB_FILE="/home/xrcloud/hubs-all-in-one/certs/perms.pub.pem"
PERMS_JWK_FILE="/home/xrcloud/hubs-all-in-one/certs/perms-jwk.json"

# Dialog(WebRTC Server) Information, can be separated to a different server if needed
DIALOG_HOST="dialog.myxrcloud.app"
DIALOG_PORT="4443"

# Hubs Database Information
DB_USER="xrcloud"
DB_PASSWORD="xrcloud-dev!"
DB_VOLUME_DIR="/app/dev.haio/db"

# Reticulum Storage(Hubs/Spoke Storage) Directory
RETICULUM_STORAGE_DIR="/data/dev.haio/storage"

# XRCLOUD Server Information
XRCLOUD_BACKEND_URL="https://xrcloud-api.dev.belivvr.com"
# API address where room logs and other information are sent to XRCLOUD, which stores this information in its internal DB and then saves it to the user's Webhook address.
LOGGING_URL="https://xrcloud-api.dev.belivvr.com/logs"
# Reticulum Route Block Option
# After setting up XRCLOUD account, change to true and run 'sudo bash clone_all.sh .env' command, then run 'sudo restart_all.sh .env' command
BLOCK_ROOT_SIGNIN="false"
```

### Installation
* The installation command is `rebuild_all.sh`, with the first argument being the environment configuration file and the second argument being the installation scope. The second argument allows separate installation of hubs or dialog servers. If no second argument is provided, it installs everything on that server.

```bash
# Full installation (assuming .env.sample was copied to .env.dev)
cd ~/xrcloud/hubs-all-in-one$
sudo bash rebuild_all.sh .env.dev
```
* When installing only hubs with dialog server separated based on .env.dev file, use 'dialog' instead of 'hubs' as the second argument on the dialog server.

```bash
# Install hubs server only
cd ~/xrcloud/hubs-all-in-one$
sudo bash rebuild_all.sh .env.dev hubs
```

### Setting Up Admin Account for XRCLOUD Connection
* When accessing the reticulum domain server configured in the environment settings, a login page will appear. Click the login button and enter any admin account to connect with XRCLOUD. Login is automatic without password verification.
    * Hubs' Email MagicLink login method has been removed. Hubs login will not be used afterwards.

<img src='./images/input_admin_id_for_XRCLOUD.png' alt='Enter XRCLOUD admin account'>

* Use the following command to make the recently logged-in hubs member an admin.
* Warning! The command below makes all hubs members admins.

```sql
docker exec db psql -U postgres -d ret_dev -c "UPDATE accounts SET is_admin = true;"
```
* If you want to configure basic Hubs Admin settings, you can access https://{reticulum server domain}:4000/admin# with that account.
* Modify the .env file as shown below and redeploy to block direct login to the reticulum server, preventing new accounts from being created directly. To regain admin access, change these settings and redeploy.

```bash
# Reticulum Route Block Option
# After setting up XRCLOUD account, change to true and run 'sudo bash clone_all.sh .env' command, then run 'sudo restart_all.sh .env' command
BLOCK_ROOT_SIGNIN="true"
```

```bash
# Regenerate .env file and restart
# Note: Reticulum may take time to restart as it rebuilds
cd ~/xrcloud/hubs-all-in-one$
sudo bash clone_all.sh .env.dev
sudo bash restart_all.sh .env.dev
```

## XRCLOUD Project Configuration
* After setting up Hubs, configure the XRCLOUD project.

### XRCLOUD Backend Build and Deployment
* **Environment Configuration File Modification**
   * Copy [~/xrcloud/xrcloud-backend/.env.sample](../xrcloud-backend/.env.sample) file to create .env.dev or .env.prod and modify it
   * This file contains various environment settings including XRCLOUD DB ID/PW, XRCLOUD API service domain, service file storage location, etc.
   * The important account for Hubs connection is RETICULUM_ADMIN_ID=dev_team@myxrcloud.app. Set this to the account you made admin in hubs.

* **Build and Deployment**: First deploy DB and Redis servers used by backend, then deploy the backend API server.
   * DB and Redis build and deployment
        ```bash
        cd ~/xrcloud/xrcloud-backend
        sudo EVN=.env.dev setup.sh
        ```
   * Backend API server build and deployment
        ```bash
        cd ~/xrcloud/xrcloud-backend
        sudo EVN=.env.dev deploy.sh
        ```
    * Servers can be restarted using docker restart command for each server.

* **DB Migration and Basic Data Input**
    * For initial installation, input DB schema and basic plan information that users will subscribe to when registering.
        ```bash
        # Run TypeOrm Migration
        docker exec -it xrcloud-backend bash
        npm run migration:run
        ```
    * **Input Basic Plan Information**
        * Connect to Xrcloud's DB and input basic plan information
        ```bash
        # Connect to Docker container using TypeORM DB info from .env file
        docker exec -it xrcloud-postgres bash
        psql -U ${TYPE_ORM_USERNAME} -d ${TYPE_ORM_DATABASE} -h localhost -p 5432
        ```
        * Execute SQL query for basic plan input (Starter and Professional examples)
        ```sql
        INSERT INTO main.tiers ("id", "createdAt", "updatedAt", "version", "name", "description", "currency", "price", "maxStorage", "maxRooms", "maxRoomSize", "isDefault") VALUES ('cc68afcb-f0db-4537-9746-aa462862c703', '2023-09-14 07:27:24.577255', '2023-09-14 07:27:24.577255', 1, 'starter', 'temp desctipion', 'KRW', '0', '500MB', 10, 10, 'true');

        INSERT INTO main.tiers ("id", "createdAt", "updatedAt", "version", "name", "description", "currency", "price", "maxStorage", "maxRooms", "maxRoomSize", "isDefault") VALUES ('b9287d85-6144-43e8-92b2-eaa1472f857b', '2023-09-14 07:29:24.577255', '2023-09-14 07:29:24.577255', 1, 'professional', 'temp desctipion', 'KRW', '99000', '25GB', 999999, 1000, 'false');
        ```

### XRCLOUD Frontend Build and Deployment
* **Environment Configuration File Modification**
   * Copy [~/xrcloud/xrcloud-frontend/.env.sample](../xrcloud-frontend/.env.sample) file to create .env.dev or .env.prod and modify it
   * The environment file contains the NEXT_PUBLIC_API_SERVER variable that sets XRCLOUD's API server's public domain. Please modify this part.
   ```bash .env
   NEXT_PUBLIC_API_SERVER=https://api.dev.my-xrcloud.com
   ```
* Frontend API server build and deployment
   ```bash
      cd ~/xrcloud/xrcloud-frontend
      sudo EVN=.env.dev deploy.sh
   ```

### XRCLOUD NGINX Configuration and Deployment
* This is a Docker service for deploying XRCLOUD as an external service.
* **Copy SSL Certificate**
   * Copy your SSL chain certificate and private key certificate as chain.pem and private.pem to the following two paths:
   * These names are configured in nginx.conf, and run.sh volume maps the ssl folder to the nginx docker container during execution.
        ```bash
        # SSL certificate path for prod
            ~/xrcloud/xrcloud-nginx/ssl
        # SSL certificate path for development
            ~/xrcloud/xrcloud-nginx/ssl.dev
        ```
* **Modify nginx Configuration File**
   * Configure your desired domain in the nginx.conf file
   * For production, modify [~/xrcloud/xrcloud-nginx/nginx.conf](../xrcloud-nginx/nginx.conf), and for development, modify [~/xrcloud/xrcloud-nginx/nginx.dev.conf](../xrcloud-nginx/nginx.dev.conf)

* **Deploy nginx**
    * Execute the following command to deploy nginx service
    ```bash
    cd ~/xrcloud/xrcloud-nginx
    # For development (change to prod for production)
    sudo run.sh dev
    ```

### Verify XRCLOUD Access
<img src='./images/xrcloud-success.png' alt='XRCLOUD success screen'>

### Full Deployment View
<img src='./images/xrcloud_all_deployed.png' alt='Full deployment view'>

# Operation Method
## Plan Upgrade
* You can now use the service through member registration.
* Plan upgrades are done by directly modifying user plan information through SQL execution in the Docker xrcloud-postgres container's DB.

```sql
# Query to upgrade registered user's plan

INSERT INTO main.subscriptions (id, "createdAt", "updatedAt", "startAt", "endAt", "adminId", "tierId", "version", "status")
VALUES (
    gen_random_uuid(),
    NOW(),
    NOW(),
    NOW(),
    NOW() + INTERVAL '1 year',
    (SELECT id FROM main.admins WHERE email = '{Email}),
    (SELECT id FROM main.tiers WHERE name = 'professional'),
    1,
    'active'
);
```

## API Documentation Update
* XRCLOUD's API Documentation uses Redocly and is documented in api.json files following OpenAPI specifications.

```
# English API documentation
~/xrcloud/xrcloud-backend/docs/api/en/api.json
# Korean API documentation
~/xrcloud/xrcloud-backend/docs/api/ko/api.json
```
* Running the shell script below will automatically generate index.html and api.md files to update the API documentation:
```bash
cd ~/xrcloud/xrcloud-backend
sudo bash regenerate_api_docs.sh
```

## Backup
* The backend project includes a [backup script](../xrcloud-backend/backup.sh) that regularly backs up XRCLOUD and hubs DBs to mounted volumes. You can set up automatic periodic backups by configuring the BACKUP_DIR and the hubs-all-in-one and xrcloud db paths (which were set in .env) at the bottom of the code and registering them in sudo crontab.
* The script doesn't reference separate .env configuration files and has backup paths directly in the source, so modify the source if paths need to be changed.
  - This script backs up xrcloud and haio databases daily.
  - Deletes files older than 7 days except for weekly and monthly backup files.
  - Weekly backup: Files created on Mondays before 60 days.
  - Monthly backup: Files created on the 1st of each month.

```shell
# Sections to modify in backup.sh
BACKUP_DIR="/mnt/xrcloud-prod-ko/backup"
backup_dir "/app/haio/db" "$BACKUP_DIR/haio-db"  # Haio backup
backup_dir "/app/xrcloud/db" "$BACKUP_DIR/xrcloud-db"  # XRCLOUD backup
```

```bash
cd ~/xrcloud/xrcloud-backend
sudo bash backup.sh
```

```bash
# crontab example
0 * * * /home/belivvr/xrcloud/xrcloud-backend/backup.sh
```

## Downloading Resources and Server Migration Method for Spoke Project
* When exporting a Spoke project, resources within the Spoke file use relative paths. When moving to another server, if the original server's resources are missing, they won't display properly due to dead links.
* Therefore, it is recommended to separately back up resource files.
* We have created a separate [script for downloading Spoke project resources](../downloadResourcesFromSpokeFile.sh) for reference.
* When running this script, it creates a resources folder and downloads the resources.
* After downloading files with this script, move them to an online-accessible space, and since the spoke file is in plain text JSON format, use a text editor to replace the resource paths, then import the spoke file again.

```bash
bash downloadResourcesFromSpokeFile.sh {spoke_file_path}
```

## Backup and Restore Environment Configuration

To back up and restore the environment configuration of your existing server, you can use the `cert_and_env_backup_tool.sh` script. This script is designed to back up configuration files with specific extensions and the `perms-jwk.json` file.

### Usage

- **Backup**: To create a backup of your current environment configuration, run the following command:
  ```bash
  bash cert_and_env_backup_tool.sh backup
  ```
  Add `-f` to force overwrite if a backup file already exists:
  ```bash
  bash cert_and_env_backup_tool.sh backup -f
  ```

- **Restore**: To restore the environment configuration from a backup, use the following command with `sudo`:
  ```bash
  sudo bash cert_and_env_backup_tool.sh restore
  ```
