ogr2ogr -nln roads -lco GEOMETRY_NAME=geom -lco FID=gid -lco PRECISION=NO Pg:"dbname=running host=localhost user=postgres port=5432 password=postgispw290834ph" roads.geojson

ogr2ogr -nln roads -lco GEOMETRY_NAME=geom -lco FID=gid -lco PRECISION=NO -nomd Pg:"dbname=running host=ep-mute-term-a1o2okdf.ap-southeast-1.aws.neon.tech user=running_owner port=5432 password=N5jeahE8ZXnQ" roads.geojson