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
data = scipy.io.loadmat('matlabSubjData.mat')
#data = scipy.io.loadmat('d_854490.mat')
#data = scipy.io.loadmat('d.mat')

# subjects

#Columns 1 through 6

 #   '854490'    '8adc5c'    '979eab'    '9ab7ab'    '9d10c8'    'a3da50'

 # Columns 7 through 8

  #  'a9952e'    'd5cd55'


data_a = np.array(data['data_d5cd55'])
data_a_complex = np.add(data_a,0.j)
data_a_complex_trans = np.transpose(data_a_complex,[2,0,1])

#B = A + A.T - np.diag(np.diag(A))


# conver to list
data_reflect = data_a_complex_trans
for i in range(0,len(data_a_complex_trans)):
    data_reflect[i] = data_a_complex_trans[i] + data_a_complex_trans[i].T -np.diag(np.diag(data_a_complex_trans[i]))
     
    
dataList = data_reflect.tolist()

# iterate through list, make fake complex
#for i in range(0,len(dataList)):
 #   for j in range(0,len(dataList[i])):
  #      for k in range(0,len(dataList[i][j])):
   #         dataList[i][j][k] = [dataList[i][j][k]]
            
# conver to encoded
dataEncode = ComplexEncoder().encode(dataList)

# write out to file 
with open('data_d5cd55.txt', 'w') as outfile:
    json.dump(dataEncode, outfile)
    
