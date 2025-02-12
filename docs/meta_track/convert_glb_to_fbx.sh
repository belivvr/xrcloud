#!/bin/bash

# Get list of GLB files to convert (sorted by time)
GLB_FILES=$(find /mnt/meta-track/members/ -name "*.glb" -type f -printf '%T@ %p\n' | sort -nr | cut -d' ' -f2-)

# Initialize counter for converted FBX files and variables for last processed file
converted_count=0
last_file=""
last_glb_file=""
last_glb_file_date=""

# Start conversion process
echo "Starting GLB to FBX conversion..."

for glb_file in $GLB_FILES; do
    # Set FBX file path (same directory as GLB file, just change extension to .fbx)
    fbx_file="${glb_file%.glb}.fbx"

    # Check if FBX file already exists and is larger than 0 bytes
    if [[ -f "$fbx_file" && -s "$fbx_file" ]]; then
        echo "FBX file already exists and is non-zero size: $fbx_file. Skipping conversion."

        # Get creation date of GLB file
        last_glb_file="$glb_file"
        last_glb_file_date=$(stat -c %y "$last_glb_file")

        echo "Conversion process stopping. Last found file: $last_glb_file"
        echo "Last GLB file creation date: $last_glb_file_date"
        exit 0 # Exit script immediately when converted file is found
    fi

    # FBX 파일이 없는 경우 변환 진행
    echo "Converting GLB to FBX: $glb_file"
    assimp export "$glb_file" "$fbx_file" fbx
    if [[ $? -eq 0 ]]; then
        echo "Successfully converted $glb_file to $fbx_file"
        last_file="$fbx_file"
        last_glb_file="$glb_file"
        last_glb_file_date=$(stat -c %y "$last_glb_file")
        converted_count=$((converted_count + 1))
    else
        echo "Failed to convert $glb_file. Skipping..."
    fi
done

# Print final conversion results
echo "Conversion process complete."
echo "Total files converted: $converted_count"
echo "Last processed file: $last_file"
echo "Last GLB file: $last_glb_file"
echo "Last GLB file creation date: $last_glb_file_date"
