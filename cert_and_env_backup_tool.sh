#!/bin/bash

# List of file extensions to back up
backup_extensions=("conf" "pem" "key" "crt" "env.*" "env")

# Backup directory and file name
backup_dir="backup"
backup_file="xrcloud_cert_and_env_backup.tar"

# Backup function
backup() {
    echo "Starting backup..."
    mkdir -p $backup_dir

    # Traverse subdirectories and back up files
    for ext in "${backup_extensions[@]}"; do
        find . -type f -name "*.$ext" -exec cp --parents {} $backup_dir \;
    done

    # perms-jwk.json file backup
    find . -type f -name "perms-jwk.json" -exec cp --parents {} $backup_dir \;

    # Backup xrcloud-backend/backup.sh
    cp --parents xrcloud-backend/backup.sh $backup_dir

    # backup files list
    echo "Files backed up:"
    find $backup_dir -type f

    # Check if backup file already exists
    if [ -f $backup_file ]; then
        if [ "$2" != "-f" ]; then
            read -p "Backup file already exists. Overwrite? (y/n): " choice
            case "$choice" in 
                y|Y ) echo "Overwriting backup file...";;
                n|N ) echo "Backup canceled."; rm -rf $backup_dir; exit 1;;
                * ) echo "Invalid choice. Backup canceled."; rm -rf $backup_dir; exit 1;;
            esac
        fi
    fi

    # Compress into a tar file with absolute paths
    (cd $backup_dir && tar --overwrite -cvf ../$backup_file .)
    echo "Backup completed: $backup_file"

    # Remove temporary backup directory
    rm -rf $backup_dir
}

# Restore function
restore() {
    echo "Starting restore..."
    if [ -f $backup_file ]; then
        # Remove the existing backup directory if it existsls
        
        rm -rf $backup_dir

        # Extract the backup file into the current directory
        tar --overwrite -xvf $backup_file

        # restored files list
        echo "Files restored:"
        tar -tf $backup_file

        echo "Restore completed."
    else
        echo "Backup file does not exist: $backup_file"
    fi
}

# Script execution options
case "$1" in
    backup)
        backup "$@"
        ;;
    restore)
        restore
        ;;
    *)
        echo "Usage: $0 {backup|restore} [-f]"
        exit 1
        ;;
esac