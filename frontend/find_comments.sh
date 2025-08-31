#!/bin/bash

find . -type f -print0 | while IFS= read -r -d '' file; do
  awk 'BEGIN { found = 0 }
       {
         while (match($0, /\/\*[^*]*\*+([^/*][^*]*\*+)*\//)) {
           comment = substr($0, RSTART + 2, RLENGTH - 4);
           if (length(comment) >= 100) {
             found = 1;
             exit;
           }
           $0 = substr($0, RSTART + RLENGTH);
         }
       }
       END {
         if (found) print FILENAME;
       }' "$file"
done

