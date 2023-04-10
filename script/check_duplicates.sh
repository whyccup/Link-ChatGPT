#!/bin/bash
# chmod +x check_duplicates.sh

file_path="../src/keywords/medical.json"

unique_count=$(jq '. | unique | length' "$file_path")
original_count=$(jq 'length' "$file_path")

if [ "$unique_count" -ne "$original_count" ]; then
    echo "存在重复元素。"
else
    echo "没有重复元素。"
fi
