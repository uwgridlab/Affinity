# this is a first pass at a data extraction script in python

# import necessary modules 

import numpy as np
import matplotlib.pyplot as plt
import json 
import scipy

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
data = scipy.io.loadmat('dataMATLAB.mat')
data_a = np.array(data['a'])
data_a_complex = np.add(data_a,0.j)
data_a_complex_trans = np.transpose(data_a_complex,[2,0,1])

# conver to list
dataList = data_a_complex_trans.tolist()

# iterate through list, make fake complex
#for i in range(0,len(dataList)):
 #   for j in range(0,len(dataList[i])):
  #      for k in range(0,len(dataList[i][j])):
   #         dataList[i][j][k] = [dataList[i][j][k]]
            
# conver to encoded
dataEncode = ComplexEncoder().encode(dataList)

# write out to file 
with open('dataFULLmatlab.txt', 'w') as outfile:
    json.dump(dataEncode, outfile)
    
