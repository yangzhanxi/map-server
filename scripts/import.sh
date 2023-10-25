#!/bin/bash


USER='_renderd'

check_db_user() {
    # Check if user _renderd is not existing, then create user.
    user_existing=$(sudo -u postgres psql -t -c "SELECT 1 FROM pg_roles WHERE rolname='$USER';")

    if [[ "$user_existing" -eq 1 ]]; then
        echo "User $USER already exists in the database."
    else
        # Create the user
        sudo -u postgres createuser $USER
        # Check the result of the creation
        if [ $? -eq 0 ]; then
            echo "User $USER has been created."
            exit 1
        else
            echo "Failed to create user $USER."
        fi
    fi
}

create_db() {
    sudo -u postgres dropdb gis
    sudo -u postgres createdb --encoding=UTF8 --owner=$USER gis
    if [[ $? -eq 0 ]]; then
        echo "Create gis DB."
    else
        echo "Create gis DB failed!"
        exit 1
    fi

    ret=$(sudo -u postgres psql gis --command='CREATE EXTENSION postgis;')
    if [[ $ret == 'CREATE EXTENSION' ]]; then
        echo "Created postgis extension."
    else
        echo "Create postgis extension failed! $ret"
        exit 1
    fi

    ret=$(sudo -u postgres psql gis --command='CREATE EXTENSION hstore;')
    if [[ $ret == 'CREATE EXTENSION' ]]; then
        echo "Created hstore extension."
    else
        echo "Create hstore extension failed! $ret"
        exit 1
    fi

    ret=$(sudo -u postgres psql gis --command="ALTER TABLE geometry_columns OWNER TO $USER;")
    if [[ $ret == 'ALTER TABLE' ]]; then
        echo "Alter table geometry_columns owner to $USER."
    else
        echo "Alter table geometry_columns owner failed! $ret"
        exit 1
    fi

    ret=$(sudo -u postgres psql gis --command="ALTER TABLE spatial_ref_sys OWNER TO $USER;")
    if [[ $ret == 'ALTER TABLE' ]]; then
        echo "Alter table spatial_ref_sys owner to $USER."
    else
        echo "Alter table spatial_ref_sys owner failed! $ret"
        exit 1
    fi
}

stop_server() {
    # Check if Apache2 is installed
    if command -v apache2 > /dev/null; then
        echo "Apache2 is installed."
        # Stop Apache2 using systemctl
        sudo systemctl stop apache2
        if [ $? -eq 0 ]; then
            echo "Apache2 has been stopped."
        else
            echo "Failed to stop Apache2."
            exit 1
        fi
    else
        echo "Apache2 is not installed."
    fi
    
    # Check if Renderd is installed
    if command -v renderd > /dev/null; then
        echo "Renderd is installed."
        # Stop Renderd using systemctl
        sudo systemctl stop renderd
        if [ $? -eq 0 ]; then
            echo "Renderd has been stopped."
        else
            echo "Failed to stop Renderd."
            exit 1
        fi
    else
        echo "Renderd is not installed."
    fi
}

start_server() {
    sudo systemctl daemon-reload
    # Check if Apache2 is installed
    if command -v apache2 > /dev/null; then
        echo "Apache2 is installed."
        # Stop Apache2 using systemctl
        sudo systemctl start apache2
        if [ $? -eq 0 ]; then
            echo "Apache2 has been started."
        else
            echo "Failed to stop Apache2."
            exit 1
        fi
    else
        echo "Apache2 is not installed."
    fi
    
    # Check if Renderd is installed
    if command -v renderd > /dev/null; then
        echo "Renderd is installed."
        # Stop Renderd using systemctl
        sudo systemctl start renderd
        if [ $? -eq 0 ]; then
            echo "Renderd has been started."
        else
            echo "Failed to stop Renderd."
            exit 1
        fi
    else
        echo "Renderd is not installed."
    fi
}

delete_tile_cache() {
    TILE_CACHE="/var/cache/renderd/tiles/"
    
    # Check if the directory exists
    if [ -d "$TILE_CACHE" ]; then
        echo "Directory '$TILE_CACHE' exists."
        # Delete the directory using rm -rf
        sudo rm -rf "$TILE_CACHE/*"
        if [ $? -eq 0 ]; then
            echo "Directory '$TILE_CACHE' has been deleted."
        else
            echo "Failed to delete directory '$TILE_CACHE'."
            exit 1
        fi
    else
        echo "Directory '$TILE_CACHE' does not exist."
    fi
}

import_data() {
    sudo -u _renderd osm2pgsql -d gis --create --slim  -G --hstore --tag-transform-script ~/src/openstreetmap-carto/openstreetmap-carto.lua -C 2500 --number-processes 2 -S ~/src/openstreetmap-carto/openstreetmap-carto.style ~/data/china-latest.osm.pbf

    # local shapefile
    cd ~/src/openstreetmap-carto/
    sudo -u _renderd psql -d gis -f indexes.sql
    sudo -u _renderd scripts/get-external-data.py
}



main() {
    stop_server
    delete_tile_cache
    check_db_user
    create_db
    import_data
    start_server
}

main
