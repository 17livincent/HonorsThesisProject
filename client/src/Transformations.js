class Transformations {

    /**
     * Find the index in the transformations object of this stepVal
     * If the stepValSelected === '', then return -1
     */
    getStepIndex(stepValSelected) {
        let index = -1;

        let steps = this.getTransformations();

        if(stepValSelected !== '') {
            for(let i in steps) {
                if(stepValSelected === steps[i].val) {
                    index = i;
                    break;
                }
            }
        }
        return index;
    }

    // return the object of transformation info
    getTransformations() {
        return (
            [
                {
                    name: 'Standardize', 
                    val: 'stand', 
                    numOfInputs: 0, 
                    inputNames: [], 
                    description: 'Transform the data to have a mean of 0, and a standard deviation of 1.', 
                    citation: ''
                },
                {
                    name: 'Normalize', 
                    val: 'norm', 
                    numOfInputs: 2, 
                    inputNames: ['Min', 'Max'], 
                    description: 'Rescale the range of the data to be between a min and max.', 
                    citation: ''
                },
                {
                    name: 'Moving average filter',
                    val: 'moving_avg',
                    numOfInputs: 1,
                    inputNames: ['Window size'],
                    description: 'Smooth data by calculating the average out of a defined number of data points.',
                    citation: ''
                }
            ]
        );
    }
}

export default Transformations;