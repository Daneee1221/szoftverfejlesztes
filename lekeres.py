import os
import glob
import shutil

from jimutmap import api, stitch_whole_tile

from flask import Flask,request
from flask_cors import CORS, cross_origin

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route("/save")
@cross_origin()
def printr():
    min_szel = float(request.args.get('min_szel'))
    max_szel = float(request.args.get('max_szel'))
    min_hosz = float(request.args.get('min_hosz'))
    max_hossz = float(request.args.get('max_hossz'))




    download_obj = api(min_lat_deg = min_szel,
                          max_lat_deg = max_szel,
                          min_lon_deg = min_hosz,
                          max_lon_deg = max_hossz,
                          zoom = 19,
                                    verbose = False,
                                    threads_ = 4,
                                container_dir = "myOutputFolder")

    # If you don't have Chrome and can't take advantage of the auto access key fetch, set
    # a.ac_key = ACCESS_KEY_STRING
    # here

    download_obj.download(getMasks = True)

    sanity_obj = api(min_lat_deg = min_szel,
                          max_lat_deg = max_szel,
                          min_lon_deg = min_hosz,
                          max_lon_deg = max_hossz,
                          zoom = 19,
                                    verbose = False,
                                    threads_ = 4,
                                    container_dir = "myOutputFolder")

    print("Cleaning up... hold on")

    sqlite_temp_files = glob.glob('*.sqlite*')



    # update_stitcher_db("myOutputFolder")
    # get_bbox_lat_lon()
    stitch_whole_tile(save_name="Kolkata", folder_name="myOutputFolder")


    print("Temporary sqlite files to be deleted = {} ? ".format(sqlite_temp_files))
    inp = input("(y/N) : ")
    if inp == 'y' or inp == 'yes' or inp == 'Y':
        for item in sqlite_temp_files:
            os.remove(item)



    ## Try to remove tree; if failed show an error using try...except on screen
    try:
        chromdriver_folders = glob.glob('[0-9]*')
        print("Temporary chromedriver folders to be deleted = {} ? ".format(chromdriver_folders))
        inp = input("(y/N) : ")
        if inp == 'y' or inp == 'yes' or inp == 'Y':
            for item in chromdriver_folders:
                shutil.rmtree(item)
    except OSError as e:
        print ("Error: %s - %s." % (e.filename, e.strerror))