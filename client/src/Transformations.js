/**
 * Transformations.js
 * @author Vincent Li <vincentl@asu.edu>
 * Includes the details of the transformation options.
 */

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
                    name: 'Normalize', 
                    val: 'norm', 
                    numOfInputs: 2, 
                    inputNames: ['Min', 'Max'], 
                    description: 'Rescale the range of the data to be between a min and max.', 
                    citation: '',
                    rules: [(inputs) => (parseFloat(inputs[0]) < parseFloat(inputs[1]))],
                    ruleDescs: ['Normalization minimum must be less than the maximum.']
                },
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
                    name: 'Box-Cox transformation',
                    val: 'box-cox',
                    numOfInputs: 0,
                    inputNames: [],
                    description: 'Performs a power transformation using the Box-Cox method.  Data are automatically scaled to positive values and returned standardized.  This transformation will not work if data is constant.',
                    citation: '',
                    rules: [],
                    ruleDescs: []
                },
                {
                    name: 'Difference transformation',
                    val: 'dif_trans',
                    numOfInputs: 0,
                    inputNames: [],
                    description: 'For all rows, subtracts the value of the previous row from the current row.  NAN\'s are will be dropped.',
                    citation: '',
                    rules: [],
                    ruleDescs: []
                },
                {
                    name: 'Divide standard deviations',
                    val: 'div_stand_devs',
                    numOfInputs: 0,
                    inputNames: [],
                    description: 'Divide each column by its standard deviation.',
                    citation: '',
                    rules: [],
                    ruleDescs: []
                },
                {
                    name: 'Moving average smoother',
                    val: 'moving_avg_smoother',
                    numOfInputs: 1,
                    inputNames: ['Window size'],
                    description: 'Smooth data by calculating the average out of a defined number of data points.  NaN\'s will be dropped.',
                    citation: '',
                    rules: [(size) => (size[0] > 0), (size) => (Number.isInteger(parseFloat(size[0])))],
                    ruleDescs: ['Filter window size must be greater than 0.', 'Filter window size must be an integer.']
                },
                {
                    name: 'Subtract means',
                    val: 'sub_means',
                    numOfInputs: 0,
                    inputNames: [],
                    description: 'Subtracts the mean from each column.',
                    citation: '',
                    rules: [],
                    ruleDescs: []
                },
                {
                    name: 'Yeo-Johnson transformation',
                    val: 'y-j',
                    numOfInputs: 0,
                    inputNames: [],
                    description: 'Performs a power transformation using the Yeo-Johnson method.  Non-positive values are allowed, and data is returned santdardized.',
                    citation: '',
                    rules: [],
                    ruleDescs: []
                }
            ]
        );
    }
}

export default Transformations;