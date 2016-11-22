# Interactive Web App For Multispectral Neural Connectivity

## <em>Affinity:</em> Connectivity Rapid Exploration Tool 

## Team Members

1. David Caldwell (davidjuliancaldwell)
3. James Wu (analogist)

## Breakdown

### Research/development process 

The project initially began due to interest by both James and David in the visualization of brain connectivity data, as electrophysiologic neural data (acquired through electrocorticography (ECoG)) is their area of domain expertise through their research work with Dr. Jeffrey Ojemann of Neurosurgery and Dr. Rajesh Rao of Computer Science. They sought out Dr. Emily Fox from Statistics, and her postdoc Dr. Nick Foti, who work with magnetoencephalography (MEG) data as suggested by the collaborator page on the CSE512 final project webpage. 

The initial design concept was focused around the idea of displaying connectivity between different brain regions on a large scale in a single visualization, and allowing for subsequent real time exploration and drill down to look more closely at specific frequency bins. The design focused on a HTML/CSS/JS/d3 implementation that required no external software or packages for the user, in contrast to many of the commercial packages available. Additionally, the design was focused on a simple to use chord diagram to represent overall connectivity patterns for a given frequency band, and a dynamic bar chart that showed connectivity between specific regions “on-click” from the chord diagram. This was to keep the visualization tool simple and lightweight, in contrast to many existing visualization tools which are quite complex. 

The first stage of development was figuring out how to load in the numpy data file provided by Dr. Nick Foti and to manipulate it in the browser. A python script was developed to offline process the data file into a .txt JSON file able to be easily loaded and interpreted in the browser. Parallel development allowed for the use of MATLAB produced electrocorticography datasets from the Ojemann laboratory. 

The initial stage of the project had the main html file point to the data file of interest, but subsequent development allowed for the selection of a data file from the browser. 

A next step was deciding how to convert the loaded in data structure to a browser mutable object. By implementing the math.js framework, matrix slicing and complex calculations were able to be performed in the browser without having to use external software or download the files locally. This was also decided upon to allow for future feature design if additional statistical metrics were to be explored. 

Various sliders and buttons were designed to allow for subselections and dynamic updates to the chord diagram. The design decision was made to allow the user to make a battery of selections and visualization choices from sliders and drop down menus, which then all submitted synchronously upon a single button click. This was in contrast to a chord diagram that updated upon every selection and may have resulted in excessive rendering and slower performance. 

In order to drill down on the global connectivity patterns, a slider allowing for the implementation of a threshold cutoff was implemented. By using this slider, the user can dynamically prune connections that are below a certain connectivity strength in the chord diagram. 

Hover features were implemented for both the chords and nodes in the chord diagram, to allow for quantitative visualization of statistical measures of connectivity. 

In order to facilitate user understanding of the graphs, options to label and color the chord diagram based off of sensor numbers or anatomic locations was added in. Additional coloring based off the angle in the complex valued connectivity values was implemented to allow for rapid evaluation of phase angle by the user on a global connectivity scale. 

The next step was to implement a dynamically updated “on-click” bar graph which showed connectivity values across frequencies between two regions selected in the chord diagram. 

The final step was to implement a dynamically updated histogram summarizing connectivities across frequencies.
### Member Contributions

David developed the initial methods of converting the python data file (.npy) provided by the collaborator Dr. Nick Foti and Dr. Emily Fox representing connectivity between various brain regions, into a JSON format which both preserved the important quantitative information present in the file and allowed it to be easily and read in the JS/d3 implementation. The current design involves a .py file which can be offline by the user, and which outputs a .txt file. Using the drag and drop loading features developed by James, this file then can be subsequently loaded into the browser for visualization. 

David also developed the initial framework for slicing and manipulating the JSON data matrix, and created the first set of sliders and dropdown boxes that allowed for subselections and updates. David using the *math.js* package created the format to allow for all of the matrix manipulations including calculating the absolute value of connectivity signals from complex numbers, taking the average across arbitrary dimensions, and slicing the data matrix in different dimensions. 

From this data, David implemented an "on-click" feature to the chord diagram which allowed for the plotting of connectivity strengths across all frequencies in a dynamic bar graph which rendered below the chord diagram.

David implemented a dynamic histogram displaying all of the connectivities for a given frequency range.

James adapted *d3.svg.arc* and *d3.layout.chord* to visualize the pairwise relationships and update on user selection, and to prune with a single slider and resize by tweening. He made sure there was a consistent reusable set of function calls that would update the chords by resizing on data load, subselection, and pruning. 

He also tried to apply the understanding of color perception to take advantage of the natural perceptual tendency to group colors, in order to convey the spatial location of brain connectivity maps by using color groupings to indicate cortical lobes. He implemented coloring chords sequentially in 2D <code>L\*a\*b</code> and 1D <code>L\*c\*h</code> color sequences to convey spatial spacing of sensor locations with relatively similar luminance to roughly equalize salience. For coloring the chords by mean phase angle, he used *ColorBrewer* as a reference to create a divergent palette to indicate angle. 

James also designed the aesthetics of the control panel using native HTML input elements and *jQuery* dual-input sliders, the overall page CSS, as well as implemented drag and drop data matrix loading using *FileDrop.js*.

David and James both worked on the background literature review for the project. Both also sought user feedback from collaborators and lab members, and implemented stylistic and design changes based off of this feedback. Both contributed to the progress report, final poster, and final paper. 

## Running Instructions

Follow the link below to arrive to the project homepage, from which the project can be run.

http://uwgridlab.github.io/Affinity/

Alternatively, follow the link below to directly run the visualization.

http://uwgridlab.github.io/Affinity/main.html

Or download the repository, and run (if you have python 3) `python -m http.server 8888` and access this from http://localhost:8888/main.html . If you have python 2, run `python -m SimpleHTTPServer 8888` and access this from http://localhost:8888/main.html . 

Additionally, download [more real-patient data](https://github.com/uwgridlab/Affinity/tree/master/data) to explore different network datasets in the visualizer via drag and drop file loading.

