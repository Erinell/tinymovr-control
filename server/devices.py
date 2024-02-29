from json import dumps
import numpy as np
import can
import time
import sys

from tinymovr.discovery import Discovery
from tinymovr.tee import init_tee
from tinymovr.config import get_bus_config, configure_logging
from tinymovr.config.config import get_device_spec

logger = configure_logging()
tms = {}
ids = []
user_ns = {}
spec = get_device_spec(4118115615)

def node_appeared(node, node_id):
    display_name = "{}{}".format(node.name, node_id)
    print("Found {} with device uid {}".format(display_name, node.uid))
    tms[node_id] = node
    user_ns[display_name] = node
    ids.append(node_id)

# not triggering this function when disconnecting...
def node_disappeared(node_id):
    display_name = "{}{}".format(tms[node_id].name, node_id)
    print("Lost {}".format(display_name))
    del user_ns[display_name]
    del tms[node_id]
    ids.remove(node_id)

params = get_bus_config(["canine", "slcan_disco"])
params["bitrate"] = 1000000
init_tee(can.Bus(**params))

dsc = Discovery(node_appeared, node_disappeared, logger)
print("Searching device(s)...")

start_time = time.time()
while len(user_ns) == 0:
    elapsed_time = time.time() - start_time
    if elapsed_time >= 5:
        print("No device(s) found!")
        sys.exit()

def process_spec(path, value):
    attributes = path.split('.')
    tm = user_ns[attributes[0]]
    nested_tm = tm
    nested_spec = spec

    attributes.pop(0)

    # all spec data
    if len(attributes) == 0:
        # for attr in dir(nested_tm):
        # print(getattr(nested_tm, attr))
        return dumps(tm, default=str), nested_spec
    
    for attr in attributes:
        nested_tm = getattr(nested_tm, attr)
        nested_spec = list(filter(lambda x: x["name"]==attr, nested_spec["remote_attributes"]))[0]
    
    # set value
    if value != None and value != '':
        if "setter_name" in nested_spec:
            _tm = tm
            for attr in attributes[:-1]:
                _tm = getattr(_tm, attr)
            setattr(_tm, attributes[-1], eval(str(value)))
    
    # Flag (warings, errors, ...)
    if nested_spec.get("flags") != None:
        if nested_tm.value == 0:
            return 0, nested_spec
        return nested_tm.value, nested_spec # return flag instead of value ?

    # List of endpoints
    if nested_spec.get("remote_attributes") != None:
        return dumps(nested_tm, default=str), nested_spec # return string list ?

    # Function
    if nested_spec.get("arguments") != None:
        if len(nested_spec.get("arguments")) == 0:
            nested_tm()

        if value != None:
            args_value = np.array(value.split(";"), dtype=int)
            if len(nested_spec.get("arguments")) == len(args_value):
                nested_tm(*args_value)
            else:
                raise Exception("The number of args does not match")

    if nested_spec.get("dtype") in ['uint8']:
        try:
            return nested_tm.value, nested_spec
        except:
            return nested_tm, nested_spec

    if nested_spec.get("dtype") in ['bool', 'string', 'float', 'uint32', 'int8'] and not nested_spec.get("arguments"):
        try:
            return nested_tm.magnitude, nested_spec
        except:
            return nested_tm, nested_spec
    
    return None, nested_spec