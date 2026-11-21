#!/bin/bash
# nachprobe.sh <id> : 8 Standbilder aus der fertigen mp4 (nach dem Render prüfen) + Kontaktbogen arbeit/post/<id>.jpg
id=$1; d=$(ffprobe -v error -show_entries format=duration -of csv=p=0 out/$id.mp4)
mkdir -p arbeit/post/$id; rm -f arbeit/post/$id/*
i=0; for f in 0.07 0.19 0.31 0.42 0.55 0.66 0.79 0.93; do i=$((i+1))
  t=$(echo "$d*$f" | bc -l); ffmpeg -v error -y -ss $t -i out/$id.mp4 -frames:v 1 -vf scale=640:-1 arbeit/post/$id/$i.jpg; done
montage arbeit/post/$id/?.jpg -tile 4x2 -geometry +4+4 -background '#222' arbeit/post/$id.jpg
