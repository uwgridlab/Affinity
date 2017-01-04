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
#data = np.load('sample_inverse_sdm.npy')

# load cvsv for eric 
#data = np.loadtxt('collaborationNoNames.csv',delimiter=',')
#data = np.loadtxt('collaborationNoNames.txt')
#
data = scipy.io.loadmat('collaborationNoNames.mat')



data_a = np.array(data['collaborationNoNames'])
data_a_complex = np.add(data_a,0.j)

# eric's data is only one dimensional (in convential frequency dimension sense)
#data_a_complex_trans = np.transpose(data_a_complex,[2,0,1])


#B = A + A.T - np.diag(np.diag(A))


# conver to list
data_reflect = data_a_complex
data_reflect = data_a_complex + data_a_complex.T -np.diag(np.diag(data_a_complex))
     
    
dataList = data_reflect.tolist()

# conver to encoded
dataEncode = ComplexEncoder().encode(dataList)

# write out to file 
with open('collaborationNoNamesConverted.txt', 'w') as outfile:
    json.dump(dataEncode, outfile)
    
