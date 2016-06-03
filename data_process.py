# this is a first pass at a data extraction script in python

# import necessary modules 

import numpy as np
import matplotlib.pyplot as plt
import json 

# define complex encoder class - from python docs
class ComplexEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, complex):
            return [obj.real, obj.imag]
         # Let the base class default method raise the TypeError
            return json.JSONEncoder.default(self, obj)

# define arr2json dump function 
def arr2json(arr):
    return json.dumps(arr.tolist())
    
    
# load data 
data = np.load('sample_inverse_sdm.npy')

# conver to list
dataList = data.tolist()
# conver to encoded
dataEncode = ComplexEncoder().encode(dataList)

# write out to file 
with open('dataFULL.txt', 'w') as outfile:
    json.dump(dataEncode, outfile)
    
