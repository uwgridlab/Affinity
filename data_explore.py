# Final project exploration

import numpy as np
import matplotlib.pyplot as plt
import json 

def arr2json(arr):
    return json.dumps(arr.tolist())

data = np.load('sample_inverse_sdm.npy')

dataReal = np.real(data)
dataAbs = np.absolute(data)
dataPhase = np.imag(data)

plt.figure(1)
plt.imshow(dataReal[50,:,:])
plt.colorbar()

plt.figure(2)
plt.imshow(dataAbs[50,:,:])
plt.colorbar()

plt.figure(3)
plt.imshow(dataPhase[50,:,:])
plt.colorbar()

subSel = data[50:60,:,:]
subSelmean = np.mean(subSel,axis=0)

subSelmean.size
plt.figure(4)
plt.imshow(np.abs(subSelmean))
plt.colorbar()

plt.figure(5)
plt.imshow(np.real(subSelmean))
plt.colorbar()

plt.figure(6)
plt.imshow(np.imag(subSelmean))
plt.colorbar()

plt.figure(7)
plt.hist(np.real(subSelmean))

plt.figure(8)
plt.hist(np.imag(subSelmean))

class ComplexEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, complex):
            return [obj.real, obj.imag]
         # Let the base class default method raise the TypeError
            return json.JSONEncoder.default(self, obj)



dataRealJ = arr2json(dataReal)
dataImagJ = arr2json(dataPhase)



with open('dataREAL.txt', 'w') as outfile:
    json.dump(dataRealJ, outfile)
    
with open('dataIMAG.txt', 'w') as outfile:
    json.dump(dataImagJ, outfile)
    
a = data[1]
b = a[0:2,0:2]
c = b.tolist()
d = ComplexEncoder().encode(c)

x = data.tolist()
y = ComplexEncoder().encode(x)

with open('dataFULL.txt', 'w') as outfile:
    json.dump(y, outfile)
    
with open('dataFULLlist.txt','w') as outfile:
    json.dump(list(y),outfile)
    