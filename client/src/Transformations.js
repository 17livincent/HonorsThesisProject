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
        /**
         * Object description:
         *      name: undefined,            // (string) the displayed name of the method 
         *      val: undefined,             // (string) the used name of the method 
         *      numOfInputs: undefined,     // (int) the number of inputs this method requires
         *      inputNames: [],             // (string)[] the names of the inputs, in order
         *      description: undefined,     // (string) the displayed description of the method
         *      citation: '',               // (string) the displayed citation of the method
         *      rules: [],                  // an array of functions to validate the required inputs
         *      ruleDescs: []               // the descriptions of each validation rule for each function, in orde
         */
        return (
            [
                {
                    name: 'Standardize', 
                    val: 'stand', 
                    numOfInputs: 0, 
                    inputNames: [], 
                    description: 'Transform the data to have a mean of 0, and a standard deviation of 1.', 
                    citation: '',
                    rules: [],
                    ruleDescs: []
                },
                {
                    name: 'Normalize', 
                    val: 'norm', 
                    numOfInputs: 2, 
                    inputNames: ['Min', 'Max'], 
                    description: 'Rescale the range of the data to be between a min and max.', 
                    citation: '',
                    rules: [(inputs) => (inputs[0] < inputs[1])],
                    ruleDescs: ['Normalization minimum must be less than the maximum.']
                },
                {
                    name: 'Moving average filter',
                    val: 'moving_avg',
                    numOfInputs: 1,
                    inputNames: ['Window size'],
                    description: 'Smooth data by calculating the average out of a defined number of data points.',
                    citation: '',
                    rules: [(size) => (size[0] > 0)],
                    ruleDescs: ['Filter window size must be greater than 0.']
                }
            ]
        );
    }
}

export default Transformations;